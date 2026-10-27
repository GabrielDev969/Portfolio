'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, scrub } from '@/motion/tokens'

/**
 * Family B on the storyboard sheet: a pencil draws each panel's frame, then its drawing, in
 * workflow order, mapped linearly to scroll (stroke-dashoffset). Nothing is pinned; the sheet
 * draws while it passes. Until this runs, and with reduced motion, the drawings are complete;
 * reduced motion fades the panels in instead.
 */
export function StoryboardDraw({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion }, { gsap }) => {
      const root = scope.current!
      const panels = gsap.utils.toArray<HTMLElement>('.board-panel', root)

      if (!motion) {
        gsap.from(panels, {
          opacity: 0,
          duration: dur.fade,
          ease: ease.out,
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        })
        return
      }

      const strokes = gsap.utils.toArray<SVGPathElement>('.board-drawing path', root)
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 })
      const pencil = gsap.timeline({
        defaults: { ease: ease.none },
        // Finished by the time the sheet's last row is three quarters up the screen, before
        // the closing line arrives.
        scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 75%', scrub },
      })
      for (const panel of panels) {
        const [frame, ...drawing] = gsap.utils.toArray<SVGPathElement>('path', panel)
        pencil
          .to(frame!, { strokeDashoffset: 0, duration: 1 })
          .to(drawing, { strokeDashoffset: 0, duration: 0.5, stagger: 0.25 })
      }
    },
    { scope },
  )

  return (
    <div ref={scope} className="col-span-12 md:col-span-10 md:col-start-2 quick:col-start-1">
      {children}
    </div>
  )
}
