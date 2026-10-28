'use client'
import { useEffect, useRef } from 'react'
import { formatTimecode } from '@/lib/timecode'
import { useViewMode } from '@/lib/view-mode'
import { refreshSoon, useMotion } from '@/motion/runtime'
import { timecode } from '@/motion/tokens'

type Props = { openingTitles: string }

const initial = '00:00:00:00'

/**
 * HH:MM:SS:FF driven by scroll progress, written straight to the DOM (never React state per frame),
 * one fixed-width slot per character: Big Shoulders has no tabular figures, so without slots the
 * clock would shift sideways as the digits change,
 * with the current section's act and name next to it. It is information, so it also runs with
 * reduced motion; Quick view hides it.
 */
export function Timecode({ openingTitles }: Props) {
  const clock = useRef<HTMLSpanElement>(null)
  const text = useRef(initial)
  const act = useRef<HTMLSpanElement>(null)
  const title = useRef<HTMLSpanElement>(null)
  const mode = useViewMode()
  const runtime = useMotion()

  useEffect(() => {
    if (mode === 'quick' || !runtime) return
    const { ScrollTrigger } = runtime
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = []
    const show = (actText: string, titleText: string) => {
      if (act.current) act.current.textContent = actText
      if (title.current) title.current.textContent = titleText
    }
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: ({ progress }) => {
          const next = formatTimecode(progress, timecode.fps, timecode.runtimeSeconds)
          const slots = clock.current?.children
          if (!slots || next === text.current) return
          for (let i = 0; i < next.length; i++) {
            if (next[i] !== text.current[i]) slots[i]!.textContent = next[i]!
          }
          text.current = next
        },
      }),
    )
    for (const section of document.querySelectorAll<HTMLElement>('[data-act-title]')) {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) show(section.dataset.act ?? '', section.dataset.actTitle ?? '')
          },
        }),
      )
    }
    refreshSoon()
    return () => triggers.forEach((t) => t.kill())
  }, [mode, runtime])

  return (
    <p className="flex items-baseline gap-3 text-small">
      <span ref={clock} className="font-display text-body font-semibold" aria-hidden="true">
        {[...initial].map((char, i) => (
          <span
            key={i}
            className={`inline-block text-center ${char === ':' ? 'w-[0.3em]' : 'w-[0.56em]'}`}
          >
            {char}
          </span>
        ))}
      </span>
      <span aria-live="off">
        <i ref={act} className="mr-1.5" />
        <span ref={title}>{openingTitles}</span>
      </span>
    </p>
  )
}
