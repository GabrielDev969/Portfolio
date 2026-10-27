import { Big_Shoulders, Newsreader } from 'next/font/google'

// Display: a tall condensed grotesque with a poster's stance (design/COMMIT-SHEET.md §3).
export const display = Big_Shoulders({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-big-shoulders',
  // next/font has no fallback metrics for this family; CLS is measured in phase 7.
  fallback: ['Arial Narrow', 'sans-serif'],
  adjustFontFallback: false,
})

// Text: a reading serif with optical sizes and real italics.
export const text = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-newsreader',
})
