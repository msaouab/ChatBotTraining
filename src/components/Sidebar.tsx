import {
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn, iconBtn, logoMark } from '../lib/cn'
import { useChatStore, useUiStore } from '../stores'
import { groupChatsByDate } from '../utils/groupChatsByDate'

export default function Sidebar() {
  const searchQuery = useUiStore((s) => s.searchQuery)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)
  const navOpen = useUiStore((s) => s.navOpen)
  const closeNav = useUiStore((s) => s.closeNav)
  const openSettings = useUiStore((s) => s.openSettings)
  const chats = useChatStore((s) => s.chats)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const selectChat = useChatStore((s) => s.selectChat)
  const newChat = useChatStore((s) => s.newChat)

  const query = searchQuery.trim().toLowerCase()
  const history = groupChatsByDate(chats)

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-sidebar shrink-0 box-border flex-col bg-sidebar px-3 py-3.5 transition-[translate,margin-right,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[translate,margin-right]',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-20 max-md:mr-0 max-md:w-[min(86vw,var(--spacing-sidebar))]',
        navOpen
          ? 'pointer-events-auto mr-0 translate-x-0 max-md:shadow-panel'
          : 'pointer-events-none -mr-sidebar -translate-x-full',
      )}
      aria-label="Conversations"
    >
      <div className="flex items-center gap-2.5 px-1.5 pb-4 pt-1">
        <div className={logoMark}>
          <Sparkles size={16} />
        </div>
        <span className="text-base font-bold tracking-tight">Nova</span>
        <button
          type="button"
          className={cn(iconBtn, 'ml-auto')}
          aria-label="Collapse sidebar"
          onClick={closeNav}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2.5 font-medium shadow-panel transition-colors hover:border-brand"
        onClick={newChat}
      >
        <Plus size={18} /> New chat{' '}
        <kbd className="ml-auto rounded-[5px] border border-border px-1.5 font-sans text-[11px] text-fg-3">
          ⌘K
        </kbd>
      </button>

      <label className="mt-3 mb-2 flex items-center gap-2 rounded-sm px-3 py-2 text-fg-3 focus-within:bg-surface">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search chats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent font-inherit text-fg outline-none"
        />
      </label>

      <nav className="-mx-1 flex-1 overflow-y-auto px-1">
        {history.map((group) => {
          const items = group.items.filter((item) =>
            item.title.toLowerCase().includes(query),
          )
          if (items.length === 0) return null

          return (
            <div key={group.label}>
              <div className="px-2.5 pt-3.5 pb-1.5 text-[11px] font-semibold tracking-wider text-fg-3 uppercase">
                {group.label}
              </div>
              {items.map((item) => {
                const active = activeChatId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      'group flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm text-fg-2',
                      active
                        ? 'bg-surface font-medium text-fg shadow-panel'
                        : 'hover:bg-surface-2 hover:text-fg',
                    )}
                    onClick={() => selectChat(item.id)}
                  >
                    <MessageSquare size={18} />
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    <MoreHorizontal
                      size={18}
                      className={cn(
                        'text-fg-3 transition-opacity',
                        active
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100',
                      )}
                    />
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="mt-2 flex items-center gap-2.5 border-t border-border px-2 pt-2.5 pb-0.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand">
          MS
        </div>
        <div className="min-w-0 flex-1 leading-snug">
          <b className="block text-sm font-semibold">Mohamed S.</b>
          <small className="text-xs text-fg-3">Free plan</small>
        </div>
        <button
          type="button"
          className={iconBtn}
          aria-label="Settings"
          aria-haspopup="dialog"
          onClick={openSettings}
        >
          <Settings size={18} />
        </button>
      </div>
    </aside>
  )
}
