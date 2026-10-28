/**
 * pnpm images — AVIF and WebP at the widths listed in src/lib/stills.ts, from the sources in
 * assets/. Runs before every build (prebuild); the output in public/stills/ is not committed.
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { stillFormats, stillPath, stills } from '../src/lib/stills'

const root = join(import.meta.dirname, '..')
let count = 0

for (const [id, still] of Object.entries(stills) as [
  keyof typeof stills,
  (typeof stills)[keyof typeof stills],
][]) {
  for (const width of still.widths) {
    for (const format of stillFormats) {
      const out = join(root, 'public', stillPath(id, width, format))
      mkdirSync(dirname(out), { recursive: true })
      const image = sharp(join(root, still.source)).resize({ width, withoutEnlargement: true })
      await (format === 'avif' ? image.avif({ quality: 55 }) : image.webp({ quality: 74 })).toFile(
        out,
      )
      count++
    }
  }
}

console.log(`${count} image files written to public/stills/`)
