'use client'
import { useViewMode } from '@/lib/view-mode'
import { ScrollTrigger, useGSAP } from '@/motion/gsap'

/** Opens the masking bars as soon as the page leaves the top, and closes them back at the top. */
export function BarsState() {
  const mode = useViewMode()

  useGSAP(
    () => {
      const root = document.documentElement
      if (mode === 'quick') {
        delete root.dataset.bars
        return
      }
      ScrollTrigger.create({
        start: 1,
        end: 'max',
        onToggle: (self) => {
          root.dataset.bars = self.isActive ? 'open' : 'closed'
        },
        onRefresh: (self) => {
          root.dataset.bars = self.isActive ? 'open' : 'closed'
        },
      })
    },
    { dependencies: [mode], revertOnUpdate: true },
  )

  return null
}
