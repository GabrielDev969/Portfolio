'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { ease, scrub } from '@/motion/tokens'

/**
 * Family C on one project, never pinned: as it crosses the screen the image pushes in
 * (1.12 → 1), scrubbed to the scroll, while the swarm's Mockup agent paints it in. Nothing with
 * words moves: the text is always simply there. With reduced motion there is nothing to do.
 */
export function ProjectPushIn({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      if (!motion) return
      const image = scope.current!.querySelector<HTMLElement>('.project-image-inner')!
      gsap.fromTo(
        image,
        { scale: 1.12 },
        {
          scale: 1,
          ease: ease.push,
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'center center',
            scrub,
          },
        },
      )
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
