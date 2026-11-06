/**
 * pnpm measure:js — gzipped JS a modern browser downloads for the first paint of each locale
 * (scripts in the HTML, minus noModule polyfills). Fails above the budget in design/PLAN.md.
 */
import { locales } from '../src/lib/i18n'
import { budgetKb, firstPaintJs } from './lib/first-paint-js'

let failed = false

for (const locale of locales) {
  const { scripts, kb } = firstPaintJs(locale)
  failed ||= kb > budgetKb
  console.log(`${locale}: ${scripts} scripts, ${kb.toFixed(1)} KB gzipped (budget ${budgetKb} KB)`)
}

if (failed) {
  console.error('Initial JS is over budget.')
  process.exit(1)
}
