import { BookOpen, Code2, Lightbulb, PenLine, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { suggestions } from '../data/suggestions'
import { logoMark, cn } from '../lib/cn'
import { useChatStore } from '../stores'
import type { SuggestionIcon } from '../types/chat'

const ICONS: Record<SuggestionIcon, LucideIcon> = {
  code: Code2,
  book: BookOpen,
  pen: PenLine,
  bulb: Lightbulb,
}

export default function EmptyState() {
  const sendMessage = useChatStore((s) => s.sendMessage)

  return (
    <div className="pt-[8vh] text-center">
      <div className={cn(logoMark, 'mx-auto mb-5 size-14 rounded-[18px]')}>
        <Sparkles size={28} />
      </div>
      <h1 className="text-[28px] font-bold tracking-tight">
        How can I help you today?
      </h1>
      <p className="mt-1.5 text-fg-2">
        Ask anything — code, writing, learning, or planning.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {suggestions.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <button
              key={item.id}
              type="button"
              className="rounded-md border border-border bg-surface px-4 py-3.5 text-left transition hover:-translate-y-px hover:border-brand"
              onClick={() => sendMessage(item.prompt)}
            >
              <b className="flex items-center gap-2 text-sm font-semibold">
                <Icon size={16} className="text-brand" />
                {item.title}
              </b>
              <span className="mt-0.5 block text-[13px] text-fg-2">
                {item.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
