import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatGeminiError, streamGeminiResponse } from '../api/gemini'
import type { ChatTurn } from '../api/gemini'
import type { ChatMessage, ChatSession } from '../types/chat'

type ChatState = {
  chats: ChatSession[]
  activeChatId: string | null
  messages: ChatMessage[]
  isGenerating: boolean
  selectChat: (id: string) => void
  newChat: () => void
  stopGenerating: () => void
  sendMessage: (text: string) => Promise<void>
}

function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  const next: ChatMessage[] = []

  for (const msg of messages) {
    if (msg.role === 'user') {
      if (typeof msg.content === 'string') next.push(msg)
      continue
    }

    if (typeof msg.content !== 'string') continue

    // Migrate older dumps that stored raw API JSON as "Error: …"
    if (msg.kind === 'error' || msg.content.startsWith('Error:')) {
      const raw = msg.content.startsWith('Error:')
        ? msg.content.slice('Error:'.length).trim()
        : msg.content
      next.push({
        id: msg.id,
        role: 'assistant',
        kind: 'error',
        content: formatGeminiError(new Error(raw)),
      })
      continue
    }

    next.push({
      id: msg.id,
      role: 'assistant',
      content: msg.content,
    })
  }

  return next
}

function sanitizeChats(chats: ChatSession[]): ChatSession[] {
  return chats.map((chat) => ({
    ...chat,
    messages: sanitizeMessages(chat.messages),
  }))
}

let requestId = 0
let abortController: AbortController | null = null
let activeBotId: string | null = null

function titleFromPrompt(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= 48) return cleaned
  return `${cleaned.slice(0, 45).trimEnd()}…`
}

function buildTurns(messages: ChatMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = []

  for (const message of messages) {
    if (message.role === 'user' && typeof message.content === 'string') {
      turns.push({ role: 'user', text: message.content })
      continue
    }

    if (
      message.role === 'assistant' &&
      typeof message.content === 'string' &&
      message.content.length > 0 &&
      !message.typing &&
      message.kind !== 'error'
    ) {
      turns.push({ role: 'model', text: message.content })
    }
  }

  return turns
}

function finalizeBotMessage(
  messages: ChatMessage[],
  botId: string,
  fallback: string,
): ChatMessage[] {
  return messages.map((msg) => {
    if (msg.id !== botId || msg.role !== 'assistant') return msg
    const content =
      typeof msg.content === 'string' && msg.content.length > 0
        ? msg.content
        : fallback
    return { id: botId, role: 'assistant', content, streaming: false }
  })
}

function finalizeErrorMessage(
  messages: ChatMessage[],
  botId: string,
  text: string,
): ChatMessage[] {
  return messages.map((msg) => {
    if (msg.id !== botId || msg.role !== 'assistant') return msg
    return {
      id: botId,
      role: 'assistant' as const,
      kind: 'error' as const,
      content: text,
      streaming: false,
    }
  })
}

function syncActiveChat(
  chats: ChatSession[],
  activeChatId: string | null,
  messages: ChatMessage[],
): ChatSession[] {
  if (!activeChatId) return chats

  const now = Date.now()
  const existing = chats.find((chat) => chat.id === activeChatId)
  if (!existing) return chats

  const updated: ChatSession = {
    ...existing,
    messages,
    updatedAt: now,
  }

  return [updated, ...chats.filter((chat) => chat.id !== activeChatId)]
}

function abortActiveRequest() {
  abortController?.abort()
  abortController = null
  requestId += 1
  activeBotId = null
}

function isAbortError(error: unknown) {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : error instanceof Error && error.name === 'AbortError'
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      messages: [],
      isGenerating: false,

      selectChat: (id) => {
        const chat = get().chats.find((item) => item.id === id)
        if (!chat) return

        abortActiveRequest()
        set({
          activeChatId: id,
          messages: chat.messages,
          isGenerating: false,
        })
      },

      stopGenerating: () => {
        const botId = activeBotId
        abortActiveRequest()

        set((state) => {
          const messages = botId
            ? finalizeBotMessage(state.messages, botId, 'Generation stopped.')
            : state.messages

          return {
            isGenerating: false,
            messages,
            chats: syncActiveChat(state.chats, state.activeChatId, messages),
          }
        })
      },

      newChat: () => {
        abortActiveRequest()
        set({
          messages: [],
          activeChatId: null,
          isGenerating: false,
        })
      },

      sendMessage: async (text) => {
        abortController?.abort()
        abortController = new AbortController()
        const { signal } = abortController

        const userId = `u-${Date.now()}`
        const botId = `b-${Date.now()}`
        const currentRequest = ++requestId
        activeBotId = botId

        const userMessage: ChatMessage = {
          id: userId,
          role: 'user',
          content: text,
        }
        const botPlaceholder: ChatMessage = {
          id: botId,
          role: 'assistant',
          typing: true,
          streaming: true,
          content: '',
        }

        set((state) => {
          const messages = [...state.messages, userMessage, botPlaceholder]
          const now = Date.now()

          if (!state.activeChatId) {
            const chatId = `c-${now}`
            const session: ChatSession = {
              id: chatId,
              title: titleFromPrompt(text),
              messages,
              createdAt: now,
              updatedAt: now,
            }

            return {
              isGenerating: true,
              activeChatId: chatId,
              messages,
              chats: [session, ...state.chats],
            }
          }

          return {
            isGenerating: true,
            messages,
            chats: syncActiveChat(state.chats, state.activeChatId, messages),
          }
        })

        const turns = buildTurns(get().messages)

        const applyMessages = (messages: ChatMessage[]) => {
          set((state) => ({
            messages,
            chats: syncActiveChat(state.chats, state.activeChatId, messages),
          }))
        }

        try {
          let receivedFirstToken = false

          for await (const chunk of streamGeminiResponse(turns, { signal })) {
            if (currentRequest !== requestId) return

            const messages = get().messages.map((msg) => {
              if (msg.id !== botId || msg.role !== 'assistant') return msg
              const previous = typeof msg.content === 'string' ? msg.content : ''
              return {
                id: botId,
                role: 'assistant' as const,
                typing: false,
                streaming: true,
                content: previous + chunk,
              }
            })

            applyMessages(messages)
            receivedFirstToken = true
          }

          if (currentRequest !== requestId) return

          if (!receivedFirstToken) {
            const messages = finalizeBotMessage(
              get().messages,
              botId,
              'Gemini returned an empty response.',
            )
            set((state) => ({
              isGenerating: false,
              messages,
              chats: syncActiveChat(state.chats, state.activeChatId, messages),
            }))
            return
          }

          const messages = get().messages.map((msg) =>
            msg.id === botId && msg.role === 'assistant'
              ? {
                  id: botId,
                  role: 'assistant' as const,
                  content: typeof msg.content === 'string' ? msg.content : '',
                  streaming: false,
                }
              : msg,
          )

          set((state) => ({
            isGenerating: false,
            messages,
            chats: syncActiveChat(state.chats, state.activeChatId, messages),
          }))
        } catch (error) {
          if (currentRequest !== requestId) return

          if (isAbortError(error) || signal.aborted) {
            const messages = finalizeBotMessage(
              get().messages,
              botId,
              'Generation stopped.',
            )
            set((state) => ({
              isGenerating: false,
              messages,
              chats: syncActiveChat(state.chats, state.activeChatId, messages),
            }))
            return
          }

          const message =
            error instanceof Error ? error.message : 'Something went wrong.'
          const messages = finalizeErrorMessage(
            get().messages,
            botId,
            message,
          )

          set((state) => ({
            isGenerating: false,
            messages,
            chats: syncActiveChat(state.chats, state.activeChatId, messages),
          }))
        } finally {
          if (currentRequest === requestId) {
            abortController = null
            activeBotId = null
            set({ isGenerating: false })
          }
        }
      },
    }),
    {
      name: 'nova-chats',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        messages: state.messages,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return

        const chats = sanitizeChats(state.chats)
        const active = chats.find((chat) => chat.id === state.activeChatId)

        state.chats = chats
        state.activeChatId = active ? state.activeChatId : null
        state.messages = active
          ? active.messages
          : sanitizeMessages(state.messages)
        state.isGenerating = false
      },
    },
  ),
)
