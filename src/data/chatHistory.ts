import type { ChatHistoryGroup } from '../types/chat'

export const chatHistory: ChatHistoryGroup[] = [
  {
    label: 'Today',
    items: [
      { id: '1', title: 'React hooks explained' },
      { id: '2', title: 'Plan a 3-day trip to Chefchaouen' },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      { id: '3', title: 'SQL join vs subquery' },
      { id: '4', title: 'Write a cover letter for a frontend role' },
    ],
  },
  {
    label: 'Previous 7 days',
    items: [
      { id: '5', title: 'How do transformers work?' },
      { id: '6', title: 'Docker compose for Node + Postgres' },
      { id: '7', title: 'Regex for email validation' },
    ],
  },
]
