import { Archivo, Newsreader, Spline_Sans_Mono } from 'next/font/google'

// Latin only: every letter of PT, EN and ES is in it (tests/unit/fonts.test.ts checks the
// content). latin-ext was preloaded too, about 280 KB the page never used.

// Display: a heavy, wide grotesque for the name and the section headings (design/COMMIT-SHEET.md
// §3, Gabriel 2026-11-06). Variable weight and width, so one file gives 800–900 at 112–125%.
export const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
})

// Text: a reading serif with optical sizes and real italics.
export const text = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-newsreader',
})

// Mono: tags, badges, key/value data, the nav, chips and the dock (design/COMMIT-SHEET.md §3).
// One weight; optional, so a slow network keeps the system mono and nothing shifts.
export const mono = Spline_Sans_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'optional',
  variable: '--font-spline-mono',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
})
