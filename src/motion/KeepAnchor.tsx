'use client'
import { useEffect } from 'react'
import { useMotion } from './runtime'

const userInput = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

/**
 * Deep links survive the pins. The browser jumps to #projects while the page loads; when GSAP
 * arrives later, pinning the Experience reel adds a screen of space above it. After each
 * ScrollTrigger refresh this puts the anchor back on screen, until the visitor scrolls, taps or
 * types, after which it never moves the page again.
 */
export function KeepAnchor() {
  const runtime = useMotion()

  useEffect(() => {
    if (!runtime || !location.hash) return
    const { ScrollTrigger } = runtime
    let touched = false
    const stop = () => {
      touched = true
    }
    const realign = () => {
      if (touched) return
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
    }
    for (const type of userInput) addEventListener(type, stop, { passive: true, once: true })
    ScrollTrigger.addEventListener('refresh', realign)
    return () => {
      ScrollTrigger.removeEventListener('refresh', realign)
      for (const type of userInput) removeEventListener(type, stop)
    }
  }, [runtime])

  return null
}
