import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import {
  ArrowUp,
  Globe,
  Lightbulb,
  Mic,
  Paperclip,
  Square,
} from 'lucide-react'
import { cn, iconBtn } from '../lib/cn'
import { useChatStore, useSettingsStore } from '../stores'

export default function Composer() {
  const sendMessage = useChatStore((s) => s.sendMessage)
  const stopGenerating = useChatStore((s) => s.stopGenerating)
  const isGenerating = useChatStore((s) => s.isGenerating)
  const enterToSend = useSettingsStore((s) => s.enterToSend)
  const [value, setValue] = useState('')
  const [searchOn, setSearchOn] = useState(false)
  const [thinkOn, setThinkOn] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const text = value.trim()
    if (!text || isGenerating) return
    void sendMessage(text)
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    if (enterToSend || e.metaKey || e.ctrlKey) {
      e.preventDefault()
      submit()
    }
  }

  const chip = (on: boolean) =>
    cn(
      'inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[13px]',
      on
        ? 'border-transparent bg-brand-soft text-brand'
        : 'border-border text-fg-2 hover:bg-surface-2 hover:text-fg',
    )

  return (
    <div className="px-3 pb-3 md:px-6 md:pb-4.5">
      <form
        className="mx-auto max-w-190 rounded-2xl border border-border bg-surface px-4 pt-3 pb-2.5 shadow-panel transition-colors focus-within:border-brand"
        onSubmit={submit}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message Nova…"
          aria-label="Message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isGenerating}
          className="max-h-50 min-h-6 w-full resize-none border-0 bg-transparent font-inherit leading-normal text-fg outline-none placeholder:text-fg-3 disabled:opacity-60"
        />
        <div className="-ml-1.5 mt-2 flex items-center gap-1">
          <button type="button" className={iconBtn} aria-label="Attach file">
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            className={chip(searchOn)}
            onClick={() => setSearchOn((v) => !v)}
          >
            <Globe size={15} />
            <span className="max-md:hidden">Search</span>
          </button>
          <button
            type="button"
            className={chip(thinkOn)}
            onClick={() => setThinkOn((v) => !v)}
          >
            <Lightbulb size={15} />
            <span className="max-md:hidden">Think</span>
          </button>
          <button
            type="button"
            className={cn(iconBtn, 'ml-auto')}
            aria-label="Voice input"
          >
            <Mic size={18} />
          </button>
          {isGenerating ? (
            <button
              type="button"
              className="ml-1 grid size-9 place-items-center rounded-[10px] bg-brand text-on-brand transition hover:bg-brand-hover"
              aria-label="Stop generating"
              onClick={stopGenerating}
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              className="ml-1 grid size-9 place-items-center rounded-[10px] bg-brand text-on-brand transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Send"
              disabled={!value.trim()}
            >
              <ArrowUp size={18} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </form>
      <p className="mt-2.5 text-center text-xs text-fg-3">
        Nova can make mistakes. Check important info.
      </p>
    </div>
  )
}
