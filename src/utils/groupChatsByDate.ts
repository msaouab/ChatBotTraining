import type { ChatHistoryGroup, ChatSession } from '../types/chat'

const DAY_MS = 24 * 60 * 60 * 1000

const GROUP_ORDER = ['Today', 'Yesterday', 'Previous 7 days', 'Older'] as const

function startOfDay(timestamp: number) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function groupLabel(updatedAt: number, now = Date.now()) {
  const today = startOfDay(now)
  const day = startOfDay(updatedAt)
  const diff = today - day

  if (diff === 0) return 'Today'
  if (diff === DAY_MS) return 'Yesterday'
  if (diff > 0 && diff < 7 * DAY_MS) return 'Previous 7 days'
  return 'Older'
}

export function groupChatsByDate(chats: ChatSession[]): ChatHistoryGroup[] {
  const buckets = new Map<string, ChatHistoryGroup['items']>()

  for (const chat of chats) {
    const label = groupLabel(chat.updatedAt)
    const items = buckets.get(label) ?? []
    items.push({
      id: chat.id,
      title: chat.title,
      updatedAt: chat.updatedAt,
    })
    buckets.set(label, items)
  }

  return GROUP_ORDER.flatMap((label) => {
    const items = buckets.get(label)
    if (!items || items.length === 0) return []
    return [{ label, items }]
  })
}
