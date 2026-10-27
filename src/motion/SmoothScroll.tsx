'use client'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { useViewMode } from '@/lib/view-mode'
import { gsap, ScrollTrigger } from './gsap'
import { useReducedMotion } from './hooks/useReducedMotion'
import { setLenis } from './lenis'
import { smoothScroll } from './tokens'

/**
 * Lenis smooths the wheel only: touch, keyboard, find-in-page and the scrollbar stay native.
 * It is driven by the GSAP ticker and is off with reduced motion and in Quick view.
 * It renders nothing, so turning it on or off never remounts the page.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()
  const mode = useViewMode()
  const enabled = !reduced && mode === 'film'

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({
      autoRaf: false,
      lerp: smoothScroll.lerp,
      syncTouch: false,
      anchors: true,
    })
    const tick = (time: number) => lenis.raf(time * 1000)
    const offScroll = lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(lenis)
    return () => {
      gsap.ticker.remove(tick)
      offScroll()
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])

  return null
}
