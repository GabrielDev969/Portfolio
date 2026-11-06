'use client'
import { useEffect } from 'react'
import type { SiteContent } from '@/content/schema'
import { useViewMode } from '@/lib/view-mode'
import { useReducedMotion } from '@/motion/hooks/useReducedMotion'

type Props = { labels: SiteContent['swarm']; locale: string }

/**
 * Starts the swarm (src/swarm/engine.ts) once the page has loaded and the browser is idle, so
 * it costs nothing at first paint: the engine is its own chunk, outside the first-paint budget.
 * Only in the full view with motion allowed; switching to Quick view, asking for reduced motion
 * or printing (which goes through Quick view) stops it and leaves the finished page.
 */
export function Swarm({ labels, locale }: Props) {
  const mode = useViewMode()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (mode !== 'full' || reduced) return
    let stop: (() => void) | undefined
    let alive = true
    let idle = 0
    // Safari has no requestIdleCallback; a short timeout stands in for it.
    const whenIdle =
      window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 300))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const start = () => {
      idle = whenIdle(
        () =>
          void import('./engine').then(({ startSwarm }) => {
            if (alive) stop = startSwarm(labels, locale)
          }),
        { timeout: 1200 },
      )
    }
    if (document.readyState === 'complete') start()
    else addEventListener('load', start, { once: true })
    return () => {
      alive = false
      removeEventListener('load', start)
      cancelIdle(idle)
      stop?.()
    }
  }, [mode, reduced, labels, locale])

  return null
}
