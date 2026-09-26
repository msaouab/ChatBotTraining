import type { Suggestion } from '../types/chat'

export const suggestions: Suggestion[] = [
  {
    id: 'explain',
    icon: 'code',
    title: 'Explain a concept',
    description: 'How does useEffect work in React?',
    prompt: 'Explain how useEffect works in React with an example',
  },
  {
    id: 'study',
    icon: 'book',
    title: 'Make a study plan',
    description: '4 weeks to learn ML basics',
    prompt: 'Give me a 4-week plan to learn machine learning basics',
  },
  {
    id: 'write',
    icon: 'pen',
    title: 'Help me write',
    description: 'An email asking for design feedback',
    prompt: 'Write a friendly email asking my team for feedback on a design',
  },
  {
    id: 'brainstorm',
    icon: 'bulb',
    title: 'Brainstorm ideas',
    description: 'Side projects to practice JavaScript',
    prompt: 'Give me 5 fun side project ideas to practice JavaScript',
  },
]
