'use client'
import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
    () => false,
  )
}
