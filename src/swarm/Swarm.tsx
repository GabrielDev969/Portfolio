'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteContent } from '@/content/schema'
import { useViewMode } from '@/lib/view-mode'
import { useReducedMotion } from '@/motion/hooks/useReducedMotion'

type Props = { labels: SiteContent['swarm']; locale: string }

/**
 * Starts the swarm (src/swarm/engine.ts) when the head script has opened the page empty for it
 * (html[data-build]): straight away, since the reader is looking at an empty page. Otherwise
 * (built earlier this session, or a deep link) it shows only the finished dock. The engine is
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
    if (mode !== 'full' || reduced) {
      delete html.dataset.build
      return
    }
    // Already built this session (a reload, a deep link): no build, but the dock is back as it
    // was at the end, with Build it again. Fetched once the browser is idle.
    const built = !('build' in html.dataset)
    let stop: (() => void) | undefined
    let alive = true
    let idle = 0
    const start = () =>
      import('./engine')
        .then(({ startSwarm }) => {
          if (!alive) return
          // Too late to build (the head script's 5 s safety already showed the page): the dock.
          stop = startSwarm(labels, locale, { built: built || !('build' in html.dataset) })
        })
        .catch(() => delete html.dataset.build)
    if (built) {
      const whenIdle = window.requestIdleCallback ?? ((run: () => void) => setTimeout(run, 300))
      idle = whenIdle(() => void start())
    } else void start()
    return () => {
      alive = false
      ;(window.cancelIdleCallback ?? clearTimeout)(idle)
      stop?.()
    }
  }, [mode, reduced, labels, locale, run])

  return null
}
