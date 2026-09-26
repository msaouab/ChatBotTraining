import { ChevronDown, Menu, Moon, Share, Sun } from 'lucide-react'
import { selectIsDark, useSettingsStore, useUiStore } from '../stores'

export default function Topbar() {
  const openNav = useUiStore((s) => s.openNav)
  const isDark = useSettingsStore(selectIsDark)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn menu-btn"
        aria-label="Open sidebar"
        onClick={openNav}
      >
        <Menu size={18} />
      </button>
      <button type="button" className="model">
        Nova 2 <span className="tag">Pro</span>
        <ChevronDown size={14} />
      </button>
      <div className="topbar-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" className="icon-btn" aria-label="Share">
          <Share size={18} />
        </button>
      </div>
    </header>
  )
}
