import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  Cpu,
  Download,
  Keyboard,
  Lock,
  LogOut,
  Monitor,
  Moon,
  Settings2,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { cn, iconBtn, logoMark } from '../lib/cn'
import { useSettingsStore, useUiStore } from '../stores'
import type { SettingsTab, TextSize, ThemePreference } from '../types/chat'

const TABS: { id: SettingsTab; label: string; icon: typeof Settings2 }[] = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'personal', label: 'Personalization', icon: Sparkles },
  { id: 'model', label: 'Model', icon: Cpu },
  { id: 'privacy', label: 'Data & privacy', icon: Lock },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'account', label: 'Account', icon: User },
]

const btn =
  'inline-flex shrink-0 items-center gap-2 rounded-sm border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-surface-2'

const field =
  'w-full rounded-sm border border-border bg-surface px-3 py-2.5 font-inherit text-sm text-fg outline-none hover:border-fg-3 focus:border-brand'

export default function Settings() {
  const open = useUiStore((s) => s.settingsOpen)
  const onClose = useUiStore((s) => s.closeSettings)
  const theme = useSettingsStore((s) => s.theme)
  const onThemeChange = useSettingsStore((s) => s.setTheme)
  const textSize = useSettingsStore((s) => s.textSize)
  const onTextSizeChange = useSettingsStore((s) => s.setTextSize)
  const enterToSend = useSettingsStore((s) => s.enterToSend)
  const onEnterToSendChange = useSettingsStore((s) => s.setEnterToSend)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [tab, setTab] = useState<SettingsTab>('general')
  const [saved, setSaved] = useState(false)
  const [creativity, setCreativity] = useState(0.7)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
  }, [])

  const flashSaved = () => {
    setSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 1400)
  }

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose()
  }

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'settings m-auto h-[min(620px,calc(100dvh-48px))] w-[min(880px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-surface p-0 text-fg shadow-[0_24px_64px_rgba(0,0,0,0.25)]',
        'open:grid open:animate-pop open:grid-cols-[220px_1fr]',
        'max-md:h-dvh max-md:w-screen max-md:max-h-none max-md:max-w-none max-md:rounded-none max-md:border-0',
        'max-md:open:grid-cols-1 max-md:open:grid-rows-[auto_1fr]',
      )}
      aria-labelledby="settingsTitle"
      onClose={onClose}
      onClick={onBackdropClick}
    >
      <nav
        className="flex flex-col gap-0.5 border-r border-border bg-sidebar px-2.5 py-4.5 max-md:flex-row max-md:gap-1 max-md:overflow-x-auto max-md:border-r-0 max-md:border-b max-md:p-2.5"
        role="tablist"
        aria-label="Settings sections"
      >
        <h2 className="px-2.5 pb-3.5 text-[17px] font-bold tracking-tight max-md:hidden">
          Settings
        </h2>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={cn(
              'flex items-center gap-2.5 whitespace-nowrap rounded-sm px-2.5 py-2 text-left text-sm text-fg-2',
              tab === id
                ? 'bg-surface font-medium text-fg shadow-panel'
                : 'hover:bg-surface-2 hover:text-fg',
            )}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex min-h-0 flex-col">
        <header className="flex items-center justify-between border-b border-border py-3.5 pr-4 pl-7 max-md:px-4 max-md:py-3">
          <h3 id="settingsTitle" className="text-base font-semibold">
            {activeTab?.label}
          </h3>
          <span
            className={cn(
              'mr-2 ml-auto flex items-center gap-1 text-xs text-success transition-opacity',
              saved ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Check size={14} />
            Saved
          </span>
          <button
            type="button"
            className={iconBtn}
            aria-label="Close settings"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        {tab === 'general' && (
          <section className="panel flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4 max-md:pt-1 max-md:pb-6" role="tabpanel">
            <Row label="Theme" hint="Choose how Nova looks on this device.">
              <Segmented
                value={theme}
                onChange={(value) => {
                  onThemeChange(value as ThemePreference)
                  flashSaved()
                }}
                options={[
                  { value: 'light', label: 'Light', icon: <Sun size={14} /> },
                  { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                  {
                    value: 'system',
                    label: 'System',
                    icon: <Monitor size={14} />,
                  },
                ]}
              />
            </Row>
            <Row
              label="Language"
              hint="Interface language. Nova replies in whatever language you write."
            >
              <Select defaultValue="Auto-detect" onChange={flashSaved}>
                <option>Auto-detect</option>
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
                <option>Español</option>
              </Select>
            </Row>
            <Row label="Text size" hint="Adjust the size of messages in the chat.">
              <Segmented
                value={textSize}
                onChange={(value) => {
                  onTextSizeChange(value as TextSize)
                  flashSaved()
                }}
                options={[
                  { value: '14px', label: 'Small' },
                  { value: '15px', label: 'Default' },
                  { value: '17px', label: 'Large' },
                ]}
              />
            </Row>
            <Row
              label="Send with Enter"
              hint="When off, use ⌘ + Enter to send and Enter for a new line."
            >
              <Switch
                checked={enterToSend}
                onChange={(checked) => {
                  onEnterToSendChange(checked)
                  flashSaved()
                }}
              />
            </Row>
            <Row
              label="Show code line numbers"
              hint="Display line numbers inside code blocks."
            >
              <Switch defaultChecked={false} onChange={flashSaved} />
            </Row>
          </section>
        )}

        {tab === 'personal' && (
          <section className="flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4" role="tabpanel">
            <Row
              stack
              label="What should Nova know about you?"
              hint="Your role, interests, or goals — used in every new chat."
            >
              <textarea
                className={field}
                rows={3}
                maxLength={1500}
                defaultValue="I'm a developer learning to build AI apps with React."
                placeholder="e.g. I'm a student at 1337 learning React and backend development."
                onChange={flashSaved}
              />
            </Row>
            <Row
              stack
              label="How should Nova respond?"
              hint="Tone, format, or anything to always (or never) do."
            >
              <textarea
                className={field}
                rows={3}
                maxLength={1500}
                placeholder="e.g. Be concise, use code examples, explain the why."
                onChange={flashSaved}
              />
            </Row>
            <Row label="Response style" hint="Default length and depth of answers.">
              <Segmented
                value="balanced"
                onChange={flashSaved}
                options={[
                  { value: 'concise', label: 'Concise' },
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'detailed', label: 'Detailed' },
                ]}
              />
            </Row>
            <Row
              label="Memory"
              hint="Let Nova remember useful details across chats. You can review or clear them anytime."
            >
              <Switch defaultChecked onChange={flashSaved} />
            </Row>
            <Row label="Saved memories" hint="12 items remembered">
              <button type="button" className={btn}>
                Manage
              </button>
            </Row>
          </section>
        )}

        {tab === 'model' && (
          <section className="flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4" role="tabpanel">
            <Row label="Default model" hint="Used when you start a new chat.">
              <Select onChange={flashSaved}>
                <option>Nova 2 Pro — most capable</option>
                <option>Nova 2 — balanced</option>
                <option>Nova Lite — fastest</option>
              </Select>
            </Row>
            <Row
              label="Creativity"
              hint="Lower is more focused and predictable; higher is more varied."
            >
              <div className="w-full shrink-0 md:w-auto">
                <div className="flex w-full items-center gap-3 md:w-55">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={creativity}
                    aria-label="Creativity"
                    className="flex-1 accent-brand"
                    onChange={(e) => {
                      setCreativity(Number(e.target.value))
                      flashSaved()
                    }}
                  />
                  <output className="w-7 text-right font-mono text-xs text-fg-2">
                    {creativity.toFixed(1)}
                  </output>
                </div>
                <div className="mt-0.5 flex justify-between pr-10 text-[11px] text-fg-3">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </Row>
            <Row
              label="Max response length"
              hint="Upper limit on tokens per reply."
            >
              <Select defaultValue="4,096 tokens" onChange={flashSaved}>
                <option>1,024 tokens</option>
                <option>4,096 tokens</option>
                <option>8,192 tokens</option>
              </Select>
            </Row>
            <Row
              label="Web search by default"
              hint="Search the web automatically when it would help."
            >
              <Switch defaultChecked={false} onChange={flashSaved} />
            </Row>
            <Row
              label="Show thinking"
              hint="Display the model's reasoning steps before its answer."
            >
              <Switch defaultChecked onChange={flashSaved} />
            </Row>
            <Row
              label="Stream responses"
              hint="Show text as it's generated instead of all at once."
            >
              <Switch defaultChecked onChange={flashSaved} />
            </Row>
          </section>
        )}

        {tab === 'privacy' && (
          <section className="flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4" role="tabpanel">
            <Row
              label="Save chat history"
              hint="When off, new chats won't appear in the sidebar and are deleted after 30 days."
            >
              <Switch defaultChecked onChange={flashSaved} />
            </Row>
            <Row
              label="Help improve Nova"
              hint="Allow your conversations to be used to train future models."
            >
              <Switch defaultChecked={false} onChange={flashSaved} />
            </Row>
            <Row label="Shared links" hint="3 conversations are shared publicly.">
              <button type="button" className={btn}>
                Manage
              </button>
            </Row>
            <Row
              label="Export data"
              hint="Download all your chats and settings as a .zip file."
            >
              <button type="button" className={btn}>
                <Download size={15} />
                Export
              </button>
            </Row>
            <div className="pt-5 text-[11px] font-semibold tracking-wider text-fg-3 uppercase">
              Danger zone
            </div>
            <Row
              label="Delete all chats"
              hint="Permanently remove every conversation. This can't be undone."
            >
              <button
                type="button"
                className={cn(
                  btn,
                  'border-[rgba(214,69,69,0.35)] text-[#d64545] hover:bg-[rgba(214,69,69,0.08)]',
                )}
              >
                <Trash2 size={15} />
                Delete all
              </button>
            </Row>
          </section>
        )}

        {tab === 'shortcuts' && (
          <section className="flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4" role="tabpanel">
            <div className="pt-5 text-[11px] font-semibold tracking-wider text-fg-3 uppercase">
              Chat
            </div>
            <KbdRow label="New chat" keys={['⌘', 'K']} />
            <KbdRow label="Send message" keys={['Enter']} />
            <KbdRow label="New line" keys={['Shift', 'Enter']} />
            <KbdRow label="Stop generating" keys={['Esc']} />
            <KbdRow label="Copy last response" keys={['⌘', 'Shift', 'C']} />
            <div className="pt-5 text-[11px] font-semibold tracking-wider text-fg-3 uppercase">
              Navigation
            </div>
            <KbdRow label="Search chats" keys={['⌘', '/']} />
            <KbdRow label="Toggle sidebar" keys={['⌘', 'B']} />
            <KbdRow label="Open settings" keys={['⌘', ',']} />
          </section>
        )}

        {tab === 'account' && (
          <section className="flex-1 overflow-y-auto px-7 pt-2 pb-7 max-md:px-4" role="tabpanel">
            <div className="mt-4 flex items-center gap-3.5 rounded-md border border-border bg-linear-to-br from-brand-soft to-transparent p-4">
              <div className={cn(logoMark, 'size-10')}>
                <Sparkles size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <b className="text-[15px]">Free plan</b>
                <small className="block text-[13px] text-fg-2">
                  31 of 50 messages used today · resets at midnight
                </small>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <i className="block h-full w-[62%] rounded-full bg-brand" />
                </div>
              </div>
              <button
                type="button"
                className={cn(
                  btn,
                  'border-transparent bg-brand text-on-brand hover:bg-brand-hover',
                )}
              >
                Upgrade
              </button>
            </div>
            <Row stack label="Display name" hint="How Nova addresses you.">
              <input
                className={field}
                defaultValue="Mohamed S."
                onChange={flashSaved}
              />
            </Row>
            <Row label="Email" hint="msaouab@student.1337.ma">
              <button type="button" className={btn}>
                Change
              </button>
            </Row>
            <Row label="Password" hint="Last changed 3 months ago">
              <button type="button" className={btn}>
                Update
              </button>
            </Row>
            <Row
              label="Log out on all devices"
              hint="Sign out of every active session, including this one."
            >
              <button type="button" className={btn}>
                <LogOut size={15} />
                Log out all
              </button>
            </Row>
            <Row
              label="Delete account"
              hint="Permanently delete your account and all data."
            >
              <button
                type="button"
                className={cn(
                  btn,
                  'border-[rgba(214,69,69,0.35)] text-[#d64545] hover:bg-[rgba(214,69,69,0.08)]',
                )}
              >
                Delete
              </button>
            </Row>
          </section>
        )}
      </div>
    </dialog>
  )
}

function Row({
  label,
  hint,
  children,
  stack = false,
}: {
  label: string
  hint: string
  children: ReactNode
  stack?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-6 border-b border-border py-4 last:border-b-0 max-md:flex-wrap max-md:gap-3',
        stack && 'flex-col items-stretch gap-2.5',
        !stack && 'has-[.switch]:max-md:flex-nowrap',
      )}
    >
      <div className="min-w-0">
        <b className="block text-sm font-medium">{label}</b>
        <small className="mt-0.5 block text-[13px] leading-snug text-fg-2">
          {hint}
        </small>
      </div>
      {children}
    </div>
  )
}

function Switch({
  checked,
  defaultChecked,
  onChange,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onChange: ((checked: boolean) => void) | (() => void)
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <label className="switch relative h-6 w-10 shrink-0">
      <input
        type="checkbox"
        className="peer absolute inset-0 z-1 m-0 cursor-pointer opacity-0"
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        onChange={handleChange}
      />
      <span className="absolute inset-0 rounded-full bg-border transition peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand peer-checked:[&::after]:translate-x-4 after:absolute after:top-0.75 after:left-0.75 after:size-4.5 after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(0,0,0,0.25)] after:transition after:content-['']" />
    </label>
  )
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string; icon?: ReactNode }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="inline-flex shrink-0 rounded-[10px] bg-surface-2 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13px] text-fg-2',
            value === option.value &&
              'bg-surface font-medium text-fg shadow-[0_1px_3px_rgba(0,0,0,0.1)]',
          )}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

function Select({
  children,
  defaultValue,
  onChange,
}: {
  children: ReactNode
  defaultValue?: string
  onChange?: () => void
}) {
  return (
    <div className="relative shrink-0">
      <select
        className="appearance-none rounded-sm border border-border bg-surface py-1.5 pr-8 pl-3 font-inherit text-sm text-fg hover:border-fg-3 focus:border-brand focus:outline-none"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-3"
      />
    </div>
  )
}

function KbdRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-b-0">
      <span>{label}</span>
      <span className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="min-w-6 rounded-md border border-border border-b-2 bg-surface-2 px-1.5 py-0.5 text-center font-sans text-xs text-fg-2"
          >
            {key}
          </kbd>
        ))}
      </span>
    </div>
  )
}
