'use client'
import { useEffect, useRef, useState } from 'react'
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
 *
 * "Build it again" (the dock, the footer) sends `swarm:replay`: the running swarm is stopped and
 * cleaned up (its stop() removes every node, listener and frame it made), the page goes back
 * to empty at the top, and a fresh one starts. Nothing piles up between runs.
 */
export function Swarm({ labels, locale }: Props) {
  const mode = useViewMode()
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  // Set by a replay: the old swarm's stop() shows the page, so the new run empties it again.
  const replaying = useRef(false)

  useEffect(() => {
    const replay = () => {
      replaying.current = true
      document.documentElement.dataset.build = ''
      scrollTo(0, 0)
      setRun((n) => n + 1)
    }
    addEventListener('swarm:replay', replay)
    return () => removeEventListener('swarm:replay', replay)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (replaying.current) {
      replaying.current = false
      html.dataset.build = ''
    }
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
  }, [mode, reduced, labels, locale, run])

  return null
}
