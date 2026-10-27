'use client'
import type Lenis from 'lenis'

// The single Lenis instance, when smooth scrolling is on (film mode, motion allowed).
let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}
