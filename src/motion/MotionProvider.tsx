'use client'
import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { useViewMode } from '@/lib/view-mode'

const loadFeatures = () => import('./motion-features').then((module) => module.default)

/** Motion for component micro-interactions only; its features load after first paint. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const mode = useViewMode()
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={mode === 'quick' ? 'always' : 'user'}>{children}</MotionConfig>
    </LazyMotion>
  )
}
