'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { ease, scrub } from '@/motion/tokens'

/**
 * Family B on the end credits, never pinned. As the section arrives its ground fades from
 * screen to black over 40 vh (the --fade variable, scrubbed; it is a colour change, so it also
 * runs with reduced motion). With motion allowed, the credits drift up a little faster than
 * the page, like a roll. Without JS the section is simply black.
 */
export function CreditsRoll({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const section = scope.current!.closest<HTMLElement>('.credits')!
      gsap.fromTo(
        section,
        { '--fade': 0 },
        {
          '--fade': 1,
          ease: ease.none,
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 60%', scrub: true },
        },
      )
      if (!motion) return
      const roll = scope.current!.querySelector<HTMLElement>('.credits-roll')!
      gsap.fromTo(
        roll,
        { y: 120 },
        {
          y: 0,
          ease: ease.none,
          scrollTrigger: { trigger: roll, start: 'top bottom', end: 'bottom 60%', scrub },
        },
      )
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
