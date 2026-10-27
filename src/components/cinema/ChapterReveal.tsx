'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, stagger } from '@/motion/tokens'

/**
 * Family A on a chapter card: the heading rises from behind its mask once, as the card arrives.
 * With reduced motion it fades instead; in Quick view and without JS it is simply there.
 */
export function ChapterReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const lines = gsap.utils.toArray<HTMLElement>('.rise-line > span', scope.current)
      const scrollTrigger = { trigger: scope.current, start: 'top 75%', once: true }
      if (motion) {
        gsap.from(lines, {
          yPercent: 110,
          duration: dur.reveal,
          ease: ease.expo,
          stagger: stagger.lines,
          scrollTrigger,
        })
      } else {
        gsap.from(lines, { opacity: 0, duration: dur.reveal, ease: ease.out, scrollTrigger })
      }
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
