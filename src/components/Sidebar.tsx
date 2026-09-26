import {
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react'
import { chatHistory } from '../data/chatHistory'
import { useChatStore, useUiStore } from '../stores'

export default function Sidebar() {
  const searchQuery = useUiStore((s) => s.searchQuery)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)
  const closeNav = useUiStore((s) => s.closeNav)
  const openSettings = useUiStore((s) => s.openSettings)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const selectChat = useChatStore((s) => s.selectChat)
  const newChat = useChatStore((s) => s.newChat)

  const query = searchQuery.trim().toLowerCase()

  return (
    <aside className="sidebar" aria-label="Conversations">
      <div className="brand">
        <div className="logo">
          <Sparkles size={16} />
        </div>
        <span className="brand-name">Nova</span>
        <button
          type="button"
          className="icon-btn"
          aria-label="Collapse sidebar"
          onClick={closeNav}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <button type="button" className="new-chat" onClick={newChat}>
        <Plus size={18} /> New chat <kbd>⌘K</kbd>
      </button>

      <label className="search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search chats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      <nav className="history">
        {chatHistory.map((group) => {
          const items = group.items.filter((item) =>
            item.title.toLowerCase().includes(query),
          )
          if (items.length === 0) return null

          return (
            <div key={group.label}>
              <div className="group-label">{group.label}</div>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chat-item${activeChatId === item.id ? ' active' : ''}`}
                  onClick={() => selectChat(item.id)}
                >
                  <MessageSquare size={18} />
                  <span>{item.title}</span>
                  <MoreHorizontal size={18} className="more" />
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="profile">
        <div className="avatar">MS</div>
        <div className="profile-meta">
          <b>Mohamed S.</b>
          <small>Free plan</small>
        </div>
        <button
          type="button"
          className="icon-btn"
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
