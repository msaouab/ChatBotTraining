import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowUp, Globe, Lightbulb, Mic, Paperclip } from 'lucide-react'
import { useChatStore, useSettingsStore } from '../stores'

export default function Composer() {
  const sendMessage = useChatStore((s) => s.sendMessage)
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
    if (!text) return
    sendMessage(text)
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    if (enterToSend || e.metaKey || e.ctrlKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="composer-wrap">
      <form className="composer" onSubmit={submit}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message Nova…"
          aria-label="Message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="composer-bar">
          <button type="button" className="icon-btn" aria-label="Attach file">
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            className={`chip${searchOn ? ' on' : ''}`}
            onClick={() => setSearchOn((v) => !v)}
          >
            <Globe size={15} />
            <span className="lbl">Search</span>
          </button>
          <button
            type="button"
            className={`chip${thinkOn ? ' on' : ''}`}
            onClick={() => setThinkOn((v) => !v)}
          >
            <Lightbulb size={15} />
            <span className="lbl">Think</span>
          </button>
          <button
            type="button"
            className="icon-btn mic-btn"
            aria-label="Voice input"
          >
            <Mic size={18} />
          </button>
          <button
            type="submit"
            className="send"
            aria-label="Send"
            disabled={!value.trim()}
          >
            <ArrowUp size={18} strokeWidth={2.2} />
          </button>
        </div>
      </form>
      <p className="disclaimer">Nova can make mistakes. Check important info.</p>
    </div>
  )
}
