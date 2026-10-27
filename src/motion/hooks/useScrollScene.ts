'use client'
import type { RefObject } from 'react'
import { useViewMode } from '@/lib/view-mode'
import { gsap, useGSAP } from '../gsap'

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
 * Every scroll scene goes through here: scoped to its component, cleaned up on unmount,
 * re-run on breakpoint and reduced-motion changes, and never run in Quick view.
 */
export function useScrollScene(
  setup: (conditions: SceneConditions) => void | (() => void),
  { scope, dependencies = [] }: Options,
) {
  const mode = useViewMode()

  useGSAP(
    () => {
      if (mode === 'quick' || !scope.current) return
      const mm = gsap.matchMedia(scope.current)
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 768px)',
        },
        (context) => setup(context.conditions as SceneConditions),
      )
      return () => mm.revert()
    },
    { scope, dependencies: [mode, ...dependencies], revertOnUpdate: true },
  )
}
