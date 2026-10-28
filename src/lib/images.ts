/**
 * Every raster image on the site. Sources live in assets/; `pnpm images` (run before each build)
 * writes AVIF and WebP at these widths into public/images/, named `${id}-${width}.${format}`.
 */
export const images = {
  gabriel: {
    source: 'assets/images/gabriel.png',
    width: 460,
    height: 460,
    widths: [240, 460],
  },
  bookowl: {
    source: 'assets/images/bookowl.png',
    width: 817,
    height: 331,
    widths: [480, 817],
  },
} as const

export type ImageId = keyof typeof images
export const imageFormats = ['avif', 'webp'] as const
export type ImageFormat = (typeof imageFormats)[number]

export function imagePath(id: ImageId, width: number, format: ImageFormat) {
  return `images/${id}-${width}.${format}`
}
