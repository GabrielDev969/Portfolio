import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import type { Locale } from '../../src/lib/i18n'
import { basePath } from '../../src/lib/site'

export const budgetKb = 180
const out = join(import.meta.dirname, '..', '..', 'out')

/**
 * Gzipped JS a modern browser downloads for the first paint of one locale: the scripts in its
 * HTML, minus noModule polyfills. Needs `pnpm build`.
 */
export function firstPaintJs(locale: Locale) {
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
  return { scripts: files.size, kb: bytes / 1024 }
}
