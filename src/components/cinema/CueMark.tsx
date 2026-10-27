'use client'
import { useRef } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'

const flashSeconds = 0.12

/**
 * The reel-change dot (design/STORYBOARD.md §2): as each chapter card enters the frame it
 * flashes twice for 120 ms, the way a projectionist's cue mark announces the next reel.
 * With reduced motion it is one slow pulse instead. It sits in the right page margin, never on
 * content. The second and last use of velvet.
 */
export function CueMark() {
  const dot = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap, ScrollTrigger }) => {
      const flash = () => {
        if (motion) {
          gsap
            .timeline()
            .set(dot.current, { opacity: 1 })
            .set(dot.current, { opacity: 0 }, `+=${flashSeconds}`)
            .set(dot.current, { opacity: 1 }, `+=${flashSeconds}`)
            .set(dot.current, { opacity: 0 }, `+=${flashSeconds}`)
        } else {
          gsap.fromTo(
            dot.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          )
        }
      }
      for (const card of document.querySelectorAll('[data-chapter-card]')) {
        ScrollTrigger.create({ trigger: card, start: 'top bottom', onEnter: flash })
      }
    },
    { scope: dot },
  )

  return (
    <div
      ref={dot}
      aria-hidden="true"
      data-cue-mark
      className="cue-mark pointer-events-none fixed z-40 rounded-full bg-velvet opacity-0 quick:hidden"
    />
  )
}
