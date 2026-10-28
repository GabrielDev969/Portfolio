'use client'
import { useSyncExternalStore } from 'react'
import { viewModeStorageKey } from './storage-keys'

/** Film is the default; Quick view turns all motion off and shows a compact summary. */
export type ViewMode = 'film' | 'quick'

const changeEvent = 'viewmodechange'

function read(): ViewMode {
  return document.documentElement.dataset.view === 'quick' ? 'quick' : 'film'
}

/** Switches the page in place; `remember: false` is for printing, which must not change the choice. */
export function setViewMode(mode: ViewMode, { remember = true } = {}) {
  document.documentElement.dataset.view = mode
  if (remember) {
    try {
      localStorage.setItem(viewModeStorageKey, mode)
    } catch {
      // Storage can be blocked; the mode still applies for this page.
    }
  }
  window.dispatchEvent(new Event(changeEvent))
}

/** The section the reader is in: the last one whose top has passed the top bar. */
export function currentSection() {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')]
  return sections.filter((s) => s.getBoundingClientRect().top <= 60).at(-1) ?? null
}

export function useViewMode(): ViewMode {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener(changeEvent, onChange)
      return () => window.removeEventListener(changeEvent, onChange)
    },
    read,
    () => 'film',
  )
}
