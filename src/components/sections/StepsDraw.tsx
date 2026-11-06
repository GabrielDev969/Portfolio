'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease } from '@/motion/tokens'

/**
 * Family B, draw: each step's drawing is traced once (stroke-dashoffset 1 → 0) as the step
 * arrives, its strokes in order, while the swarm's Diagram agent visits it. Nothing is pinned
 * or scrubbed. Until this runs, without JS and with reduced motion, the drawings are complete.
 */
export function StepsDraw({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const root = scope.current!
      const steps = gsap.utils.toArray<HTMLElement>('.step', root)

      if (!motion) return

      for (const step of steps) {
        const strokes = gsap.utils.toArray<SVGPathElement>('path', step)
        gsap.fromTo(
          strokes,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: dur.draw,
            ease: ease.push,
            stagger: dur.draw / strokes.length,
            scrollTrigger: { trigger: step, start: 'top 85%', once: true },
          },
        )
      }
    },
    { scope },
  )

  return (
    <div ref={scope} className="col-span-12">
      {children}
    </div>
  )
}
