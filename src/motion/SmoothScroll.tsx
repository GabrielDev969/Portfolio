'use client'
import { useEffect } from 'react'
import { useViewMode } from '@/lib/view-mode'
import { useReducedMotion } from './hooks/useReducedMotion'
import { setLenis } from './lenis'
import { useMotion } from './runtime'
import { smoothScroll } from './tokens'

/**
 * Lenis smooths the wheel only: touch, keyboard, find-in-page and the scrollbar stay native.
 * It is fetched after first paint, driven by the GSAP ticker, and off with reduced motion and
 * in Quick view. It renders nothing, so turning it on or off never remounts the page.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()
  const mode = useViewMode()
  const runtime = useMotion()
  const enabled = runtime !== null && !reduced && mode === 'full'

  useEffect(() => {
    if (!enabled || !runtime) return
    const { gsap, ScrollTrigger } = runtime
    let stop: (() => void) | undefined
    let alive = true

    void import('lenis').then(({ default: Lenis }) => {
      if (!alive) return
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
      stop = () => {
        gsap.ticker.remove(tick)
        offScroll()
        lenis.destroy()
        setLenis(null)
      }
    })

    return () => {
      alive = false
      stop?.()
    }
  }, [enabled, runtime])

  return null
}
