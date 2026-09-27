import { GoogleGenAI, ApiError } from '@google/genai'

const MODEL = 'gemini-3.8-flash'
const MAX_RETRIES = 3
const RETRY_BASE_MS = 800

export type ChatTurn = {
  role: 'user' | 'model'
  text: string
}

function getClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Add it to your .env file and restart the dev server.',
    )
  }
  return new GoogleGenAI({ apiKey })
}

function isRetryable(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 503 || error.status === 429
  }
  if (error instanceof Error) {
    return /503|429|high demand|unavailable|RESOURCE_EXHAUSTED/i.test(
      error.message,
    )
  }
  return false
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

/** Peel nested Gemini `{ error: { message } }` payloads down to a human string. */
function extractNestedMessage(raw: string): string | null {
  let current: unknown = raw.trim()

  for (let depth = 0; depth < 4; depth++) {
    if (typeof current !== 'string') break

    const trimmed = current.trim()
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return trimmed.length > 0 ? trimmed : null
    }

    try {
      current = JSON.parse(trimmed)
    } catch {
      return trimmed.length > 0 ? trimmed : null
    }

    if (
      current &&
      typeof current === 'object' &&
      'error' in current &&
      current.error &&
      typeof current.error === 'object' &&
      'message' in current.error &&
      typeof (current.error as { message: unknown }).message === 'string'
    ) {
      current = (current.error as { message: string }).message
      continue
    }

    if (
      current &&
      typeof current === 'object' &&
      'message' in current &&
      typeof (current as { message: unknown }).message === 'string'
    ) {
      current = (current as { message: string }).message
      continue
    }

    break
  }

  return typeof current === 'string' && current.trim() ? current.trim() : null
}

function messageLooksLikeQuota(text: string) {
  return /quota|rate limit|RESOURCE_EXHAUSTED|exceeded your current/i.test(text)
}

/**
 * Turn SDK / network failures into short, user-facing copy.
 * Never returns raw JSON blobs.
 */
export function formatGeminiError(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = extractNestedMessage(error.message) ?? error.message

    if (error.status === 429 || messageLooksLikeQuota(detail)) {
      return "You've hit the Gemini rate or quota limit. Check your plan and billing, then try again in a moment."
    }
    if (error.status === 401 || error.status === 403) {
      return 'Gemini rejected the API key. Check VITE_GEMINI_API_KEY in your .env file.'
    }
    if (error.status === 404) {
      return 'The selected Gemini model was not found. Check the model name and try again.'
    }
    if (error.status === 503 || error.status >= 500) {
      return 'Gemini is having trouble right now. Please wait a moment and try again.'
    }
    if (detail && !detail.trim().startsWith('{')) return detail
    return `Gemini request failed (${error.status}). Please try again.`
  }

  if (error instanceof Error) {
    const detail = extractNestedMessage(error.message) ?? error.message

    if (messageLooksLikeQuota(detail) || /429/.test(error.message)) {
      return "You've hit the Gemini rate or quota limit. Check your plan and billing, then try again in a moment."
    }
    if (/503|high demand|unavailable/i.test(detail)) {
      return 'Gemini is having trouble right now. Please wait a moment and try again.'
    }
    if (/Missing VITE_GEMINI_API_KEY/.test(error.message)) {
      return error.message
    }
    if (detail.trim().startsWith('{')) {
      return 'Something went wrong talking to Gemini. Please try again.'
    }
    return detail
  }

  return 'Something went wrong. Please try again.'
}

/**
 * Stream Gemini tokens. Pass full conversation turns for multi-turn context.
 * Retries transient 503/429 responses a few times.
 * Training note: runs in the browser with a Vite-exposed key.
 */
export async function* streamGeminiResponse(
  turns: ChatTurn[],
  options?: { signal?: AbortSignal },
) {
  const ai = getClient()
  const contents = turns.map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }))

  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (options?.signal?.aborted) return

    try {
      const responseStream = await ai.models.generateContentStream({
        model: MODEL,
        contents,
        config: {
          abortSignal: options?.signal,
        },
      })

      for await (const chunk of responseStream) {
        if (options?.signal?.aborted) return
        const text = chunk.text
        if (text) yield text
      }
      return
    } catch (error) {
      lastError = error
      if (!isRetryable(error) || attempt === MAX_RETRIES) break
      await sleep(RETRY_BASE_MS * attempt, options?.signal)
    }
  }

  throw new Error(formatGeminiError(lastError))
}
