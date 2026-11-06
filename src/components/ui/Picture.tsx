import { asset } from '@/lib/site'
import { imagePath, images, type ImageFormat, type ImageId } from '@/lib/images'

type Props = {
  id: ImageId
  alt: string
  /** The rendered width, for the browser to pick a source: e.g. "(min-width: 768px) 12vw, 40vw". */
  sizes: string
  className?: string
  /** On the first screen: fetched straight away, not when it nears the viewport. */
  eager?: boolean
}

/** An image from public/images/ as AVIF with a WebP fallback, sized so it never shifts the layout. */
export function Picture({ id, alt, sizes, className = '', eager = false }: Props) {
  const image = images[id]
  const srcSet = (format: ImageFormat) =>
    image.widths.map((w) => `${asset(imagePath(id, w, format))} ${w}w`).join(', ')
  const largest = image.widths[image.widths.length - 1]!

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      {/* Static export: the image is pre-optimized by `pnpm images`, so a plain <img> inside <picture>. */}
      <img
        src={asset(imagePath(id, largest, 'webp'))}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
