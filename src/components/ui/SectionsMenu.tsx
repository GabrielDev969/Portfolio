'use client'
import { m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { dur } from '@/motion/tokens'

type Section = { href: string; label: string }
type Props = { label: string; navLabel: string; sections: Section[] }

const easeOut = [0.215, 0.61, 0.355, 1] as const

/**
 * A native <details> menu, so it works without JS. With JS it closes on Esc (focus returns
 * to the button), on an outside click and after choosing a section, and the list opens with
 * a short clip-path reveal.
 */
export function SectionsMenu({ label, navLabel, sections }: Props) {
  const [open, setOpen] = useState(false)
  const details = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      details.current?.querySelector('summary')?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!details.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <details
      ref={details}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="relative"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center px-1.5 text-small whitespace-nowrap underline-offset-4 hover:underline sm:px-2 [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <m.nav
        key={String(open)}
        aria-label={navLabel}
        initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
        transition={{ duration: dur.ui, ease: easeOut }}
        className="absolute top-full right-0 mt-2 min-w-56 border border-ink/15 bg-screen-2 p-2 text-ink"
      >
        <ul>
          {sections.map((section) => (
            <li key={section.href}>
              <a
                href={section.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center px-3 text-body underline-offset-4 hover:underline"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </m.nav>
    </details>
  )
}
