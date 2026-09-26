import { create } from 'zustand'

type UiState = {
  navOpen: boolean
  settingsOpen: boolean
  searchQuery: string
  openNav: () => void
  closeNav: () => void
  toggleNav: () => void
  openSettings: () => void
  closeSettings: () => void
  setSearchQuery: (query: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  navOpen: false,
  settingsOpen: false,
  searchQuery: '',
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
  toggleNav: () => set((state) => ({ navOpen: !state.navOpen })),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
