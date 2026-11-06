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

type Tone = { shadow: readonly number[]; light: readonly number[] }

/**
 * A duotone at full resolution, before resizing, so it stays sharp: the image in greys,
 * stretched to its full range and leveled, each grey mapped between the shadow and the light.
 */
async function duotone(source: string, { shadow, light }: Tone) {
  const { data, info } = await sharp(join(root, source))
    .greyscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(info.width * info.height * 3)
  for (let i = 0; i < info.width * info.height; i++) {
    // Levels: the grey backdrop sinks into the shadow, the face keeps its light.
    const t = Math.min(Math.max((data[i * info.channels]! / 255 - 0.3) / 0.62, 0), 1) ** 1.1
    for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(shadow[c]! + (light[c]! - shadow[c]!) * t)
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png()
    .toBuffer()
}

for (const [id, image] of Object.entries(images) as [
  keyof typeof images,
  (typeof images)[keyof typeof images],
][]) {
  for (const width of image.widths) {
    for (const format of imageFormats) {
      const out = join(root, 'public', imagePath(id, width, format))
      mkdirSync(dirname(out), { recursive: true })
      const source = 'duotone' in image ? await duotone(image.source, image.duotone) : join(root, image.source)
      const resized = sharp(source).resize({ width, withoutEnlargement: true })
      await (
        format === 'avif' ? resized.avif({ quality: 55 }) : resized.webp({ quality: 74 })
      ).toFile(out)
      count++
    }
  }
}

console.log(`${count} image files written to public/images/`)
