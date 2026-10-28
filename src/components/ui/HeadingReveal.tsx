'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, stagger } from '@/motion/tokens'

/**
 * Family A on a section title: it rises from behind its mask once, as it arrives. With reduced
 * motion it fades instead; in Quick view and without JS it is simply there. While it plays,
 * the heading carries data-revealing, so tests can wait for it to land.
 */
export function HeadingReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const lines = gsap.utils.toArray<HTMLElement>('.rise-line > span', scope.current)
      const heading = scope.current!
      const scrollTrigger = { trigger: heading, start: 'top 85%', once: true }
      const marks = {
        onStart: () => heading.setAttribute('data-revealing', ''),
        onComplete: () => heading.removeAttribute('data-revealing'),
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
      return () => heading.removeAttribute('data-revealing')
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
