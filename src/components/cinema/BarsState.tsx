'use client'
import { useEffect } from 'react'
import { useViewMode } from '@/lib/view-mode'

/**
 * Opens the masking bars as soon as the page leaves the top and closes them back at the top,
 * and again once the end credits ([data-bars-close]) reach the top of the screen, the way a
 * cinema masks down for the credits. IntersectionObservers do it, so the peak never waits
 * for GSAP to load.
 */
export function BarsState() {
  const mode = useViewMode()

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'quick') {
      delete root.dataset.bars
      return
    }
    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    Object.assign(sentinel.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      pointerEvents: 'none',
    })
    document.body.prepend(sentinel)
    let atTop = false
    let inCredits = false
    const update = () => {
      root.dataset.bars = atTop || inCredits ? 'closed' : 'open'
    }
    const top = new IntersectionObserver(([entry]) => {
      atTop = entry?.isIntersecting ?? false
      update()
    })
    top.observe(sentinel)
    // The root is the top 1% of the screen: the credits intersect it once their top has passed.
    const credits = new IntersectionObserver(
      ([entry]) => {
        inCredits = entry?.isIntersecting ?? false
        update()
      },
      { rootMargin: '0px 0px -99% 0px' },
    )
    const end = document.querySelector('[data-bars-close]')
    if (end) credits.observe(end)
    return () => {
      top.disconnect()
      credits.disconnect()
      sentinel.remove()
    }
  }, [mode])

  return null
}
