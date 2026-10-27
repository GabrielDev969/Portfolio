'use client'
import { setViewMode, useViewMode } from '@/lib/view-mode'
import { peekMotion } from '@/motion/runtime'

type Props = { quickView: string; filmView: string }

/** The section the reader is in: the last one whose top has passed the top bar. */
function currentSection() {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')]
  return sections.filter((s) => s.getBoundingClientRect().top <= 60).at(-1) ?? null
}

/** Film view ↔ Quick view, switched in place, keeping the reader's section on screen. */
export function QuickViewToggle({ quickView, filmView }: Props) {
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
      {quick ? filmView : quickView}
    </button>
  )
}
