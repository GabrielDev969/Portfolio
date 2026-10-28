'use client'
import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { currentSection, setViewMode } from '@/lib/view-mode'
import { peekMotion } from './runtime'

/**
 * Paper gets Quick view. The print media query alone is not enough: scenes that already ran
 * leave GSAP's inline styles behind (hidden titles, a horizontal strip, pin spacers). So the
 * page switches to Quick view before printing, which reverts every scene, without saving the
 * choice, and goes back to the full page, on the same section, afterwards.
 */
export function PrintAsQuickView() {
  useEffect(() => {
    let section: HTMLElement | null = null
    let switched = false

    const before = () => {
      if (document.documentElement.dataset.view === 'quick') return
      section = currentSection()
      switched = true
      // Commit and revert the scenes now: the browser lays out the print as soon as this returns.
      flushSync(() => setViewMode('quick', { remember: false }))
    }
    const after = () => {
      if (!switched) return
      switched = false
      setViewMode('full', { remember: false })
      requestAnimationFrame(() => {
        section?.scrollIntoView({ block: 'start' })
        peekMotion()?.ScrollTrigger.refresh()
      })
    }

    addEventListener('beforeprint', before)
    addEventListener('afterprint', after)
    return () => {
      removeEventListener('beforeprint', before)
      removeEventListener('afterprint', after)
    }
  }, [])

  return null
}
