'use client'
import { useEffect, type RefObject } from 'react'
import { useViewMode } from '@/lib/view-mode'
import { refreshSoon, useMotion, type MotionRuntime } from '../runtime'

export type SceneConditions = {
  /** prefers-reduced-motion: no-preference */
  motion: boolean
  /** prefers-reduced-motion: reduce */
  reduced: boolean
  /** min-width: 768px */
  desktop: boolean
}

type Options = {
  scope: RefObject<HTMLElement | null>
  dependencies?: unknown[]
}

/**
 * Every scroll scene goes through here. It waits for the lazily loaded GSAP runtime, scopes
 * selectors to the component, re-runs on breakpoint and reduced-motion changes, reverts
 * everything on unmount, and never runs in Quick view. (It does what @gsap/react's useGSAP
 * does, without importing GSAP into the first-paint bundle.)
 */
export function useScrollScene(
  setup: (conditions: SceneConditions, runtime: MotionRuntime) => void | (() => void),
  { scope, dependencies = [] }: Options,
) {
  const mode = useViewMode()
  const runtime = useMotion()

  useEffect(() => {
    const element = scope.current
    if (!runtime || mode === 'quick' || !element) return
    const { gsap } = runtime
    const context = gsap.context(() => {
      gsap.matchMedia(element).add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 768px)',
        },
        (media) => setup(media.conditions as SceneConditions, runtime),
      )
    }, element)
    refreshSoon()
    return () => context.revert()
    // `setup` is a fresh closure on every render; the scene re-runs only when these change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtime, mode, scope, ...dependencies])
}
