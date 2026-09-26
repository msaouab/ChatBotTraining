import { create } from 'zustand'
import { initialMessages } from '../data/initialMessages'
import type { ChatMessage } from '../types/chat'

type ChatState = {
  activeChatId: string | null
  messages: ChatMessage[]
  selectChat: (id: string) => void
  newChat: () => void
  sendMessage: (text: string) => void
}

let replyTimer: ReturnType<typeof setTimeout> | null = null

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: '1',
  messages: initialMessages,
  selectChat: (activeChatId) => set({ activeChatId }),
  newChat: () => {
    if (replyTimer) clearTimeout(replyTimer)
    replyTimer = null
    set({ messages: [], activeChatId: null })
  },
  sendMessage: (text) => {
    const userId = `u-${Date.now()}`
    const botId = `b-${Date.now()}`

    set((state) => ({
      messages: [
        ...state.messages,
        { id: userId, role: 'user', content: text },
        { id: botId, role: 'assistant', typing: true },
      ],
    }))

    if (replyTimer) clearTimeout(replyTimer)
    replyTimer = setTimeout(() => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === botId && msg.role === 'assistant'
            ? {
                ...msg,
                typing: false,
                kind: 'placeholder',
                prompt: text,
              }
            : msg,
        ),
      }))
      replyTimer = null
    }, 1200)
  },
}))
