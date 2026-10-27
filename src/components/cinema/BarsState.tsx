'use client'
import { useEffect } from 'react'
import { useViewMode } from '@/lib/view-mode'

/**
 * Opens the masking bars as soon as the page leaves the top and closes them back at the top.
 * A 1px sentinel and an IntersectionObserver do it, so the peak never waits for GSAP to load.
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
    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.bars = entry?.isIntersecting ? 'closed' : 'open'
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [mode])

  return null
}
