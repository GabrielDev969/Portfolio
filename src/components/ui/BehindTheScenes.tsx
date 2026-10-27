'use client'
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { useViewMode } from '@/lib/view-mode'
import { getLenis } from '@/motion/lenis'

type Props = {
  id: string
  /** "Behind the scenes" */
  label: string
  /** The project title, which names the drawer. */
  title: string
  close: string
  children: ReactNode
}

const noop = () => () => {}

/** False in the server HTML and during hydration, true from then on. */
function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}

const button =
  'inline-flex min-h-12 cursor-pointer list-none items-center justify-center rounded-[2px] border border-current px-6 font-semibold transition-opacity duration-(--dur-ui) ease-(--ease-out) hover:opacity-85 focus-visible:outline-ink [&::-webkit-details-marker]:hidden'

/**
 * A project's behind the scenes, in the form each view needs:
 * - without JS (and until hydration), a native <details> that opens in place;
 * - in film mode, a button that opens a modal <dialog> drawer from the right. Esc, the close
 *   button and a click on the backdrop close it, and focus returns to the button. The drawer
 *   scrolls natively (data-lenis-prevent) while the page behind it stays still;
 * - in Quick view, the parts inline, with no button.
 * The content is the same server-rendered parts in every form.
 */
export function BehindTheScenes({ id, label, title, close, children }: Props) {
  const hydrated = useHydrated()
  const mode = useViewMode()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  // If the view switches while the drawer is open, the page must not stay frozen.
  useEffect(() => () => getLenis()?.start(), [mode])

  if (!hydrated) {
    return (
      <details className="bts-details">
        <summary className={button}>{label}</summary>
        <div className="bts-inline">{children}</div>
      </details>
    )
  }

  if (mode === 'quick') {
    return (
      <div className="bts-inline">
        <p className="text-small italic">{label}</p>
        {children}
      </div>
    )
  }

  const open = () => {
    getLenis()?.stop()
    dialog.current?.showModal()
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-controls={`${id}-bts`}
        onClick={open}
        className={button}
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        id={`${id}-bts`}
        aria-labelledby={`${id}-bts-label ${id}-bts-title`}
        data-lenis-prevent
        className="bts-drawer"
        onClose={() => {
          getLenis()?.start()
          trigger.current?.focus()
        }}
        // A click on the backdrop lands on the <dialog> itself; clicks inside land on its content.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className="bts-sheet">
          <header className="bts-sheet-head">
            <div>
              <p id={`${id}-bts-label`} className="text-small italic">
                {label}
              </p>
              <p id={`${id}-bts-title`} className="font-display text-scene font-bold uppercase">
                {title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="inline-flex min-h-11 cursor-pointer items-center px-2 text-small underline-offset-4 hover:underline"
            >
              {close}
            </button>
          </header>
          {children}
        </div>
      </dialog>
    </>
  )
}
