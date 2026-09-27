import type { ReactNode } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

export type TextSize = '14px' | '15px' | '17px'

export type ChatItem = {
  id: string
  title: string
  updatedAt: number
}

export type ChatHistoryGroup = {
  label: string
  items: ChatItem[]
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export type SuggestionIcon = 'code' | 'book' | 'pen' | 'bulb'

export type Suggestion = {
  id: string
  icon: SuggestionIcon
  title: string
  description: string
  prompt: string
}

export type ChatMessage =
  | {
      id: string
      role: 'user'
      content: string
    }
  | {
      id: string
      role: 'assistant'
      typing?: boolean
      streaming?: boolean
      kind?: 'demo' | 'placeholder' | 'error'
      prompt?: string
      content?: ReactNode
    }

export type DisplayMessage = {
  id: string
  role: 'user' | 'assistant'
  content?: ReactNode
  typing?: boolean
  streaming?: boolean
  error?: boolean
}

export type SettingsTab =
  | 'general'
  | 'personal'
  | 'model'
  | 'privacy'
  | 'shortcuts'
  | 'account'
