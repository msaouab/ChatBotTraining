import type { ChatMessage } from '../types/chat'

export const initialMessages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content:
      'Can you explain React hooks simply? I keep mixing up useState and useEffect.',
  },
  {
    id: 'b1',
    role: 'assistant',
    kind: 'demo',
  },
]
