'use client'
import { useRef, type ReactNode } from 'react'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease, scrub } from '@/motion/tokens'

/**
 * Family B, the reel. On wide screens with motion allowed it marks the strip `data-strip="on"`
 * (CSS lays it out horizontally), pins it under the top bar and maps vertical scroll to sideways
 * travel, 1:1 in pixels. Frames that start off-screen slide their caption in as they cross 85%.
 * The pinned distance is the track's overflow, which the frame width keeps within one screen
 * height at 1440 × 900 (tests/e2e/experience.spec.ts). Phones and reduced motion keep the
 * vertical strip and only fade captions in.
 */
export function ExperienceStrip({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    ({ motion, desktop }, { gsap }) => {
      const root = scope.current!
      const captions = gsap.utils.toArray<HTMLElement>('.strip-caption', root)

      if (motion && desktop) {
        root.dataset.strip = 'on'
        const pin = root.querySelector<HTMLElement>('.strip-pin')!
        const track = root.querySelector<HTMLElement>('.strip-track')!
        const barOpen = () =>
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top-bar')) || 0
        const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth)

        const reel = gsap.to(track, {
          x: () => -distance(),
          ease: ease.none,
          scrollTrigger: {
            trigger: pin,
            start: () => `top ${barOpen()}px`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub,
            invalidateOnRefresh: true,
          },
        })

        for (const caption of captions) {
          const frame = caption.closest('.strip-item')!
          if (frame.getBoundingClientRect().left < innerWidth * 0.85) continue
          gsap.from(caption, {
            x: 40,
            opacity: 0,
            duration: dur.reveal,
            ease: ease.out,
            scrollTrigger: { trigger: frame, containerAnimation: reel, start: 'left 85%' },
          })
        }
        return () => {
          delete root.dataset.strip
        }
      }

      for (const caption of captions) {
        gsap.from(caption, {
          opacity: 0,
          duration: dur.reveal,
          ease: ease.out,
          scrollTrigger: { trigger: caption, start: 'top 85%', once: true },
        })
      }
    },
    { scope },
  )

  return (
    <div ref={scope} className="strip">
      {children}
    </div>
  )
}
