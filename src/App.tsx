import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import Composer from './components/Composer'
import EmptyState from './components/EmptyState'
import Message, { DemoBotReply, PlaceholderReply } from './components/Message'
import Settings from './components/Settings'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import {
  useChatStore,
  useSettingsStore,
  useUiStore,
} from './stores'
import type { ChatMessage } from './types/chat'

function renderAssistantContent(message: ChatMessage): ReactNode {
  if (message.role !== 'assistant') return null
  if (message.kind === 'demo') return <DemoBotReply />
  if (message.kind === 'placeholder' && message.prompt) {
    return <PlaceholderReply text={message.prompt} />
  }
  return message.content
}

export default function App() {
  const navOpen = useUiStore((s) => s.navOpen)
  const toggleNav = useUiStore((s) => s.toggleNav)
  const openSettings = useUiStore((s) => s.openSettings)
  const textSize = useSettingsStore((s) => s.textSize)
  const setSystemDark = useSettingsStore((s) => s.setSystemDark)
  const messages = useChatStore((s) => s.messages)
  const newChat = useChatStore((s) => s.newChat)
  const threadRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setSystemDark])

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      const key = e.key.toLowerCase()
      if (key === 'k') {
        e.preventDefault()
        newChat()
      } else if (key === 'b') {
        e.preventDefault()
        toggleNav()
      } else if (e.key === ',') {
        e.preventDefault()
        openSettings()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [newChat, openSettings, toggleNav])

  return (
    <>
      <div className={`app${navOpen ? ' nav-open' : ''}`}>
        <Sidebar />
        <div className="scrim" aria-hidden="true" />

        <main className="main">
          <Topbar />

          <section
            className="thread"
            ref={threadRef}
            style={{ fontSize: textSize }}
          >
            <div className="thread-inner">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((message) => (
                  <Message
                    key={message.id}
                    message={{
                      id: message.id,
                      role: message.role,
                      typing:
                        message.role === 'assistant' ? message.typing : false,
                      content:
                        message.role === 'assistant'
                          ? renderAssistantContent(message)
                          : message.content,
                    }}
                  />
                ))
              )}
            </div>
          </section>

          <Composer />
        </main>
      </div>

      <Settings />
    </>
  )
}
