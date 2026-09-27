import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const NEAR_BOTTOM_PX = 80

function isNearBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX
}

type UseSmartScrollOptions = {
  /** When this changes (e.g. active chat), re-pin and snap to bottom. */
  resetKey?: string | null
  /** Rising edge (false → true) re-pins and snaps, e.g. user sent a message. */
  forcePin?: boolean
}

/**
 * Keeps a scroll container pinned to the bottom while content grows,
 * unless the user scrolls away. Scrolls are instant and coalesced to one
 * write per animation frame so streaming tokens don't fight CSS smooth-scroll.
 */
export function useSmartScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  { resetKey = null, forcePin = false }: UseSmartScrollOptions = {},
) {
  const [isPinned, setIsPinned] = useState(true)
  const pinnedRef = useRef(true)
  const rafRef = useRef<number | null>(null)
  const programmaticRef = useRef(false)
  const prevForcePinRef = useRef(forcePin)

  const setPinned = useCallback((next: boolean) => {
    pinnedRef.current = next
    setIsPinned((prev) => (prev === next ? prev : next))
  }, [])

  const scrollToBottomNow = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    programmaticRef.current = true
    el.scrollTop = el.scrollHeight
    requestAnimationFrame(() => {
      programmaticRef.current = false
    })
  }, [scrollerRef])

  const scheduleFollow = useCallback(() => {
    if (!pinnedRef.current) return
    if (rafRef.current != null) return

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!pinnedRef.current) return
      scrollToBottomNow()
    })
  }, [scrollToBottomNow])

  const scrollToBottom = useCallback(() => {
    setPinned(true)
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      scrollToBottomNow()
    })
  }, [scrollToBottomNow, setPinned])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const onScroll = () => {
      if (programmaticRef.current) return
      setPinned(isNearBottom(scroller))
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [scrollerRef, setPinned])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new ResizeObserver(() => {
      scheduleFollow()
    })
    observer.observe(content)

    return () => {
      observer.disconnect()
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollerRef, contentRef, scheduleFollow])

  // Chat switch / mount: pin + snap (defer setState to avoid sync effect cascade).
  useEffect(() => {
    pinnedRef.current = true
    queueMicrotask(() => setIsPinned(true))
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      scrollToBottomNow()
    })
  }, [resetKey, scrollToBottomNow])

  // Send message: pin + snap on rising edge of forcePin.
  useEffect(() => {
    const rising = forcePin && !prevForcePinRef.current
    prevForcePinRef.current = forcePin
    if (!rising) return
    pinnedRef.current = true
    queueMicrotask(() => setIsPinned(true))
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      scrollToBottomNow()
    })
  }, [forcePin, scrollToBottomNow])

  return { isPinned, scrollToBottom }
}
