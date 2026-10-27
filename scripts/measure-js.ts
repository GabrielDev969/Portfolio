/**
 * pnpm measure:js — gzipped JS a modern browser downloads for the first paint of each locale
 * (scripts in the HTML, minus noModule polyfills). Fails above the budget in design/PLAN.md.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { locales } from '../src/lib/i18n'
import { basePath } from '../src/lib/site'

const budgetKb = 180
const out = join(import.meta.dirname, '..', 'out')
let failed = false

for (const locale of locales) {
  const html = readFileSync(join(out, locale, 'index.html'), 'utf8')
  const tags = html.match(/<script[^>]*src="[^"]+\.js"[^>]*>/g) ?? []
  const files = new Set(
    tags
      .filter((tag) => !/nomodule/i.test(tag))
      .map((tag) => tag.match(/src="([^"]+)"/)![1]!.slice(basePath.length + 1)),
  )
  const bytes = [...files].reduce(
    (sum, f) => sum + gzipSync(readFileSync(join(out, f)), { level: 9 }).length,
    0,
  )
  const kb = bytes / 1024
  failed ||= kb > budgetKb
  console.log(
    `${locale}: ${files.size} scripts, ${kb.toFixed(1)} KB gzipped (budget ${budgetKb} KB)`,
  )
}

if (failed) {
  console.error('Initial JS is over budget.')
  process.exit(1)
}
