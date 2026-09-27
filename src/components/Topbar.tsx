import { ChevronDown, Menu, Moon, Share, Sun } from 'lucide-react'
import { cn, iconBtn } from '../lib/cn'
import { selectIsDark, useSettingsStore, useUiStore } from '../stores'

export default function Topbar() {
  const openNav = useUiStore((s) => s.openNav)
  const navOpen = useUiStore((s) => s.navOpen)
  const isDark = useSettingsStore(selectIsDark)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)

  return (
    <header className="flex h-15 items-center gap-2 border-b border-border bg-app px-2 md:px-4">
      <button
        type="button"
        className={cn(
          iconBtn,
          'transition-[opacity,width,margin] duration-200',
          navOpen &&
            'md:pointer-events-none md:m-0 md:w-0 md:min-w-0 md:overflow-hidden md:opacity-0',
        )}
        aria-label="Open sidebar"
        onClick={openNav}
      >
        <Menu size={18} />
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 font-semibold hover:bg-surface-2"
      >
        Nova 2{' '}
        <span className="rounded-full bg-brand-soft px-2 py-px text-[11px] font-semibold text-brand">
          Pro
        </span>
        <ChevronDown size={14} className="text-fg-3" />
      </button>
      <div className="ml-auto flex gap-1">
        <button
          type="button"
          className={iconBtn}
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" className={iconBtn} aria-label="Share">
          <Share size={18} />
        </button>
      </div>
    </header>
  )
}
