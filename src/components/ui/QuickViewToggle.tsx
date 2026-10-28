'use client'
import { currentSection, setViewMode, useViewMode } from '@/lib/view-mode'
import { peekMotion } from '@/motion/runtime'

type Props = { quickView: string; fullView: string }

/** Full view ↔ Quick view, switched in place, keeping the reader's section on screen. */
export function QuickViewToggle({ quickView, fullView }: Props) {
  const mode = useViewMode()
  const quick = mode === 'quick'

  const toggle = () => {
    const section = currentSection()
    setViewMode(quick ? 'film' : 'quick')
    requestAnimationFrame(() => {
      section?.scrollIntoView({ block: 'start' })
      peekMotion()?.ScrollTrigger.refresh()
    })
  }

  return (
    <button
      type="button"
      aria-pressed={quick}
      onClick={toggle}
      className="hidden min-h-11 items-center px-1.5 text-small whitespace-nowrap underline-offset-4 hover:underline sm:px-2 js:inline-flex"
    >
      {/* CSS picks the label, so it is right before hydration too (the store reads "film" then). */}
      <span className="quick:hidden">{quickView}</span>
      <span className="hidden quick:inline">{fullView}</span>
    </button>
  )
}
