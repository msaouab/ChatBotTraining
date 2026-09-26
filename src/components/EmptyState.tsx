import { BookOpen, Code2, Lightbulb, PenLine, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { suggestions } from '../data/suggestions'
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
    <div className="empty">
      <div className="logo">
        <Sparkles size={28} />
      </div>
      <h1>How can I help you today?</h1>
      <p>Ask anything — code, writing, learning, or planning.</p>
      <div className="suggestions">
        {suggestions.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <button
              key={item.id}
              type="button"
              className="suggestion"
              onClick={() => sendMessage(item.prompt)}
            >
              <b>
                <Icon size={16} />
                {item.title}
              </b>
              <span>{item.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
