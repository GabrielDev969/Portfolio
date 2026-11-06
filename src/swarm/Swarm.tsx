'use client'
import { useEffect } from 'react'
import type { SiteContent } from '@/content/schema'
import { useViewMode } from '@/lib/view-mode'
import { useReducedMotion } from '@/motion/hooks/useReducedMotion'

type Props = { labels: SiteContent['swarm']; locale: string }

/**
 * Starts the swarm (src/swarm/engine.ts) when the head script has opened the page empty for it
 * (html[data-build]): straight away, since the reader is looking at an empty page. The engine is
 * its own chunk, outside the first-paint budget. If it cannot load, the page is simply shown.
 * Switching to Quick view, asking for reduced motion or printing (which goes through Quick
 * view) stops it, and the page is all there.
 */
export function Swarm({ labels, locale }: Props) {
  const mode = useViewMode()
  const reduced = useReducedMotion()

  useEffect(() => {
    const html = document.documentElement
    if (!('build' in html.dataset)) return
    if (mode !== 'full' || reduced) {
      delete html.dataset.build
      return
    }
    let stop: (() => void) | undefined
    let alive = true
    import('./engine')
      .then(({ startSwarm }) => {
        // Too late (the head script's 5 s safety already showed the page): nothing to build.
        if (alive && 'build' in html.dataset) stop = startSwarm(labels, locale)
      })
      .catch(() => delete html.dataset.build)
    return () => {
      alive = false
      stop?.()
    }
  }, [mode, reduced, labels, locale])

  return null
}
