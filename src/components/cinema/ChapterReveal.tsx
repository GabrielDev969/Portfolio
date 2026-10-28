'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, stagger } from '@/motion/tokens'

/**
 * Family A on a chapter card: the heading rises from behind its mask once, as the card arrives.
 * With reduced motion it fades instead; in Quick view and without JS it is simply there.
 * While it plays, the card carries data-revealing, so tests can wait for it to land.
 */
export function ChapterReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const lines = gsap.utils.toArray<HTMLElement>('.rise-line > span', scope.current)
      const card = scope.current!
      const scrollTrigger = { trigger: card, start: 'top 75%', once: true }
      const marks = {
        onStart: () => card.setAttribute('data-revealing', ''),
        onComplete: () => card.removeAttribute('data-revealing'),
      }
      if (motion) {
        gsap.from(lines, {
          yPercent: 110,
          duration: dur.reveal,
          ease: ease.expo,
          stagger: stagger.lines,
          scrollTrigger,
          ...marks,
        })
      } else {
        gsap.from(lines, {
          opacity: 0,
          duration: dur.reveal,
          ease: ease.out,
          scrollTrigger,
          ...marks,
        })
      }
      // A scene reverted mid-reveal (Quick view, a breakpoint change) never completes.
      return () => card.removeAttribute('data-revealing')
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
