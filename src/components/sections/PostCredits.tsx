'use client'
import { useRef, type MouseEvent } from 'react'
import { getLenis } from '@/motion/lenis'
import { useScrollScene } from '@/motion/hooks/useScrollScene'
import { dur, ease } from '@/motion/tokens'

type Props = { line: string; rewind: string }

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * After the credits (design/STORYBOARD.md §9): a deliberate rest of black, one card, and
 * "Rewind the reel". The rewind scrolls back to the top in 1.6 s; the timecode follows the
 * scroll, so it visibly counts back to 00:00:00:00, and the bars close at the top. With
 * reduced motion it jumps. Without JS it is a plain #top link. Hidden in Quick view.
 */
export function PostCredits({ line, rewind }: Props) {
  const scope = useRef<HTMLDivElement>(null)

  useScrollScene(
    (_, { gsap }) => {
      const card = scope.current!.querySelector('.post-credits-card')
      gsap.from(card, {
        opacity: 0,
        duration: 0.6,
        ease: ease.out,
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      })
    },
    { scope },
  )

  const rewindReel = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const lenis = getLenis()
    if (lenis && !reduced()) {
      // easeInOutCubic: the reel spins up, then settles on the first frame.
      lenis.scrollTo(0, {
        duration: dur.rewind,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
        force: true,
      })
    } else {
      scrollTo({ top: 0, behavior: reduced() ? 'instant' : 'smooth' })
    }
    // Keyboard and screen reader users start again from the top too.
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <div ref={scope} className="post-credits quick:hidden">
      <div className="post-credits-card">
        <p className="font-text text-scene text-balance italic">{line}</p>
        <a
          href="#top"
          onClick={rewindReel}
          className="mt-8 inline-flex min-h-11 items-center underline underline-offset-4"
        >
          {rewind}
        </a>
      </div>
    </div>
  )
}
