import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import {
  Check,
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
      className="settings"
      aria-labelledby="settingsTitle"
      onClose={onClose}
      onClick={onBackdropClick}
    >
      <nav className="settings-nav" role="tablist" aria-label="Settings sections">
        <h2>Settings</h2>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="tab"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="settings-body">
        <header className="settings-head">
          <h3 id="settingsTitle">{activeTab?.label}</h3>
          <span className={`saved${saved ? ' show' : ''}`}>
            <Check size={14} />
            Saved
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close settings"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        {tab === 'general' && (
          <section className="panel" role="tabpanel">
            <Row
              label="Theme"
              hint="Choose how Nova looks on this device."
            >
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
              <select
                className="select"
                defaultValue="Auto-detect"
                onChange={flashSaved}
              >
                <option>Auto-detect</option>
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
                <option>Español</option>
              </select>
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
          <section className="panel" role="tabpanel">
            <Row
              stack
              label="What should Nova know about you?"
              hint="Your role, interests, or goals — used in every new chat."
            >
              <textarea
                className="field"
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
                className="field"
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
              <button type="button" className="btn">
                Manage
              </button>
            </Row>
          </section>
        )}

        {tab === 'model' && (
          <section className="panel" role="tabpanel">
            <Row label="Default model" hint="Used when you start a new chat.">
              <select className="select" onChange={flashSaved}>
                <option>Nova 2 Pro — most capable</option>
                <option>Nova 2 — balanced</option>
                <option>Nova Lite — fastest</option>
              </select>
            </Row>
            <Row
              label="Creativity"
              hint="Lower is more focused and predictable; higher is more varied."
            >
              <div className="slider-col">
                <div className="slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={creativity}
                    aria-label="Creativity"
                    onChange={(e) => {
                      setCreativity(Number(e.target.value))
                      flashSaved()
                    }}
                  />
                  <output>{creativity.toFixed(1)}</output>
                </div>
                <div className="slider-scale">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </Row>
            <Row
              label="Max response length"
              hint="Upper limit on tokens per reply."
            >
              <select className="select" defaultValue="4,096 tokens" onChange={flashSaved}>
                <option>1,024 tokens</option>
                <option>4,096 tokens</option>
                <option>8,192 tokens</option>
              </select>
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
          <section className="panel" role="tabpanel">
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
              <button type="button" className="btn">
                Manage
              </button>
            </Row>
            <Row
              label="Export data"
              hint="Download all your chats and settings as a .zip file."
            >
              <button type="button" className="btn">
                <Download size={15} />
                Export
              </button>
            </Row>
            <div className="section-title">Danger zone</div>
            <Row
              label="Delete all chats"
              hint="Permanently remove every conversation. This can't be undone."
            >
              <button type="button" className="btn danger">
                <Trash2 size={15} />
                Delete all
              </button>
            </Row>
          </section>
        )}

        {tab === 'shortcuts' && (
          <section className="panel" role="tabpanel">
            <div className="section-title">Chat</div>
            <KbdRow label="New chat" keys={['⌘', 'K']} />
            <KbdRow label="Send message" keys={['Enter']} />
            <KbdRow label="New line" keys={['Shift', 'Enter']} />
            <KbdRow label="Stop generating" keys={['Esc']} />
            <KbdRow label="Copy last response" keys={['⌘', 'Shift', 'C']} />
            <div className="section-title">Navigation</div>
            <KbdRow label="Search chats" keys={['⌘', '/']} />
            <KbdRow label="Toggle sidebar" keys={['⌘', 'B']} />
            <KbdRow label="Open settings" keys={['⌘', ',']} />
          </section>
        )}

        {tab === 'account' && (
          <section className="panel" role="tabpanel">
            <div className="plan-card">
              <div className="logo">
                <Sparkles size={20} />
              </div>
              <div>
                <b>Free plan</b>
                <small>31 of 50 messages used today · resets at midnight</small>
                <div className="usage">
                  <i />
                </div>
              </div>
              <button type="button" className="btn primary">
                Upgrade
              </button>
            </div>
            <Row stack label="Display name" hint="How Nova addresses you.">
              <input
                className="field"
                defaultValue="Mohamed S."
                onChange={flashSaved}
              />
            </Row>
            <Row label="Email" hint="msaouab@student.1337.ma">
              <button type="button" className="btn">
                Change
              </button>
            </Row>
            <Row label="Password" hint="Last changed 3 months ago">
              <button type="button" className="btn">
                Update
              </button>
            </Row>
            <Row
              label="Log out on all devices"
              hint="Sign out of every active session, including this one."
            >
              <button type="button" className="btn">
                <LogOut size={15} />
                Log out all
              </button>
            </Row>
            <Row
              label="Delete account"
              hint="Permanently delete your account and all data."
            >
              <button type="button" className="btn danger">
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
    <div className={`row${stack ? ' stack' : ''}`}>
      <div className="row-label">
        <b>{label}</b>
        <small>{hint}</small>
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
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        onChange={handleChange}
      />
      <span />
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
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
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

function KbdRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="kbd-row">
      <span>{label}</span>
      <span>
        {keys.map((key) => (
          <kbd key={key}>{key}</kbd>
        ))}
      </span>
    </div>
  )
}
