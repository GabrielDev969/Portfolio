/**
 * pnpm images — AVIF and WebP at the widths listed in src/lib/images.ts, from the sources in
 * assets/. Runs before every build (prebuild); the output in public/images/ is not committed.
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { imageFormats, imagePath, images } from '../src/lib/images'

const root = join(import.meta.dirname, '..')
let count = 0

for (const [id, image] of Object.entries(images) as [
  keyof typeof images,
  (typeof images)[keyof typeof images],
][]) {
  for (const width of image.widths) {
    for (const format of imageFormats) {
      const out = join(root, 'public', imagePath(id, width, format))
      mkdirSync(dirname(out), { recursive: true })
      const resized = sharp(join(root, image.source)).resize({ width, withoutEnlargement: true })
      await (
        format === 'avif' ? resized.avif({ quality: 55 }) : resized.webp({ quality: 74 })
      ).toFile(out)
      count++
    }
  }
}

console.log(`${count} image files written to public/images/`)
