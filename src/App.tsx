import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import Composer from './components/Composer'
import EmptyState from './components/EmptyState'
import Message, { DemoBotReply, PlaceholderReply } from './components/Message'
import Settings from './components/Settings'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { useSmartScroll } from './hooks/useSmartScroll'
import { cn } from './lib/cn'
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
  const closeNav = useUiStore((s) => s.closeNav)
  const toggleNav = useUiStore((s) => s.toggleNav)
  const openSettings = useUiStore((s) => s.openSettings)
  const textSize = useSettingsStore((s) => s.textSize)
  const setSystemDark = useSettingsStore((s) => s.setSystemDark)
  const messages = useChatStore((s) => s.messages)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const isGenerating = useChatStore((s) => s.isGenerating)
  const newChat = useChatStore((s) => s.newChat)
  const threadRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { isPinned, scrollToBottom } = useSmartScroll(threadRef, contentRef, {
    resetKey: activeChatId,
    forcePin: isGenerating,
  })

  const showJumpToBottom = !isPinned && messages.length > 0

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setSystemDark])

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
      <div className="flex h-dvh overflow-hidden">
        <Sidebar />
        <div
          className={cn(
            'fixed inset-0 z-10 bg-black/35 transition-opacity duration-300 md:hidden',
            navOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          )}
          aria-hidden="true"
          onClick={closeNav}
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Topbar />

          <section
            className="flex-1 overflow-y-auto"
            ref={threadRef}
            style={{ fontSize: textSize }}
          >
            <div
              ref={contentRef}
              className="mx-auto max-w-190 px-4 py-5 md:px-6 md:pt-8 md:pb-6"
            >
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
                      streaming:
                        message.role === 'assistant'
                          ? message.streaming
                          : false,
                      error:
                        message.role === 'assistant' &&
                        message.kind === 'error',
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

          <div className="relative">
            <button
              type="button"
              className={cn(
                'absolute bottom-full left-1/2 z-10 mb-3 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-border bg-surface text-fg-2 shadow-panel transition hover:bg-surface-2 hover:text-fg',
                showJumpToBottom
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0',
              )}
              aria-label="Scroll to latest"
              tabIndex={showJumpToBottom ? 0 : -1}
              onClick={scrollToBottom}
            >
              <ArrowDown size={18} strokeWidth={2.2} />
            </button>
            <Composer />
          </div>
        </main>
      </div>

      <Settings />
    </>
  )
}
