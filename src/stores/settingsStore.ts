import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TextSize, ThemePreference } from '../types/chat'

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement
  if (theme === 'system') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = theme
  }
}

function readSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

type SettingsState = {
  theme: ThemePreference
  textSize: TextSize
  enterToSend: boolean
  systemDark: boolean
  setTheme: (theme: ThemePreference) => void
  setTextSize: (size: TextSize) => void
  setEnterToSend: (value: boolean) => void
  setSystemDark: (value: boolean) => void
  toggleTheme: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      textSize: '15px',
      enterToSend: true,
      systemDark: readSystemDark(),
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      setTextSize: (textSize) => set({ textSize }),
      setEnterToSend: (enterToSend) => set({ enterToSend }),
      setSystemDark: (systemDark) => set({ systemDark }),
      toggleTheme: () => {
        const { theme, systemDark } = get()
        const isDark = theme === 'system' ? systemDark : theme === 'dark'
        const next: ThemePreference = isDark ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: 'nova-settings',
      partialize: (state) => ({
        theme: state.theme,
        textSize: state.textSize,
        enterToSend: state.enterToSend,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

export const selectIsDark = (state: SettingsState) =>
  state.theme === 'system' ? state.systemDark : state.theme === 'dark'
