/**
 * Every raster image on the site. Sources live in assets/; `pnpm images` (run before each build)
 * writes AVIF and WebP at these widths into public/stills/, named `${id}-${width}.${format}`.
 */
export const stills = {
  gabriel: {
    source: 'assets/stills/gabriel.png',
    width: 460,
    height: 460,
    widths: [240, 460],
  },
  bookowl: {
    source: 'assets/scenes/bookowl.png',
    width: 817,
    height: 331,
    widths: [480, 817],
  },
} as const

export type StillId = keyof typeof stills
export const stillFormats = ['avif', 'webp'] as const
export type StillFormat = (typeof stillFormats)[number]

export function stillPath(id: StillId, width: number, format: StillFormat) {
  return `stills/${id}-${width}.${format}`
}
