'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, scrub, stagger } from '@/motion/tokens'

/**
 * Family C on one project, never pinned: as it crosses the screen the still pushes in
 * (1.12 → 1) while the cast lines rise like credits, scrubbed to the scroll. The logline is
 * family A, rising once behind its mask when the project's top passes 70%. With reduced
 * motion the still and the cast fade in once, and the logline is simply there.
 */
export function ProjectPushIn({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap, SplitText }) => {
      const root = scope.current!
      const still = root.querySelector<HTMLElement>('.project-still-inner')!
      const cast = gsap.utils.toArray<HTMLElement>('.cast-line > span', root)

      if (!motion) {
        gsap.from([still, ...cast], {
          opacity: 0,
          duration: dur.fade,
          ease: ease.out,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        })
        return
      }

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub },
        })
        .fromTo(still, { scale: 1.12 }, { scale: 1, ease: ease.push, duration: 1 }, 0)
        .from(cast, { yPercent: 100, ease: ease.push, duration: 0.4, stagger: stagger.items }, 0.35)

      const split = SplitText.create(root.querySelector('.project-logline'), {
        type: 'lines',
        mask: 'lines',
        // Lines only, so the text reads the same split or not; the default would put an
        // aria-label on the <p>, which a paragraph may not carry.
        aria: 'none',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: dur.reveal,
            ease: ease.expo,
            stagger: stagger.lines,
            scrollTrigger: { trigger: root, start: 'top 70%', once: true },
          }),
      })
      return () => split.revert()
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
