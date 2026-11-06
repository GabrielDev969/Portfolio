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
    setViewMode(quick ? 'full' : 'quick')
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
      title={quick ? fullView : quickView}
      className="hidden size-11 items-center justify-center rounded-[3px] text-ink-2 transition-colors duration-150 hover:text-ink aria-pressed:text-accent js:inline-flex"
    >
      {/* A terminal: the compact, text-only page. CSS picks the name, so it is right before
          hydration too (the store reads "full" then). */}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
        <rect
          x="2.5"
          y="3.5"
          width="15"
          height="13"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="m6 8 2.5 2L6 12M10 12.5h4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only quick:hidden">{quickView}</span>
      <span className="sr-only hidden quick:inline">{fullView}</span>
    </button>
  )
}
