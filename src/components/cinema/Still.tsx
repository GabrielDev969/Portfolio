import { asset } from '@/lib/site'
import { stillPath, stills, type StillFormat, type StillId } from '@/lib/stills'

type Props = {
  id: StillId
  alt: string
  /** The rendered width, for the browser to pick a source: e.g. "(min-width: 768px) 12vw, 40vw". */
  sizes: string
  className?: string
}

/** A still from public/stills/ as AVIF with a WebP fallback, sized so it never shifts the layout. */
export function Still({ id, alt, sizes, className = '' }: Props) {
  const still = stills[id]
  const srcSet = (format: StillFormat) =>
    still.widths.map((w) => `${asset(stillPath(id, w, format))} ${w}w`).join(', ')
  const largest = still.widths[still.widths.length - 1]!

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      {/* Static export: the image is pre-optimized by `pnpm images`, so a plain <img> inside <picture>. */}
      <img
        src={asset(stillPath(id, largest, 'webp'))}
        alt={alt}
        width={still.width}
        height={still.height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  )
}
