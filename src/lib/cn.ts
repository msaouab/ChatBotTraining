export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export const iconBtn =
  'inline-grid size-9 place-items-center rounded-sm text-fg-2 transition hover:bg-surface-2 hover:text-fg'

export const logoMark =
  'grid size-8 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-brand to-[#a26bf5] text-white'
