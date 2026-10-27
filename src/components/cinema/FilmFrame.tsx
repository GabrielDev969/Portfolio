import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** What the frame shows, for screen readers when the picture itself is decorative. */
  description: string
  className?: string
}

/**
 * A still treated as a film frame: one crop ratio for the whole set (2.39:1, 4:3 on phones),
 * light grain and a desaturating layer that lifts on hover or focus with an opacity crossfade.
 */
export function FilmFrame({ children, description, className = '' }: Props) {
  return (
    <figure className={`group relative overflow-hidden bg-house ${className}`}>
      <div className="aspect-[4/3] md:aspect-[2.39/1]">{children}</div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-screen opacity-25 mix-blend-saturation transition-opacity duration-(--dur-ui) ease-(--ease-out) group-focus-within:opacity-0 group-hover:opacity-0 motion-reduce:transition-none"
      />
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  )
}
