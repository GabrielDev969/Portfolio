import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** What the frame shows, for screen readers when the picture itself is decorative. */
  description: string
  className?: string
}

/**
 * A still treated as a film frame: a black mat around one crop ratio for the whole set
 * (2.39:1, 4:3 on phones), so a light screenshot never melts into the light page. A
 * desaturating layer lifts while the project (`group/project`) is hovered or holds focus, with
 * an opacity crossfade; `filter` never animates.
 */
export function FilmFrame({ children, description, className = '' }: Props) {
  return (
    <figure className={`bg-house p-[clamp(8px,1.1vw,16px)] ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[2.39/1]">
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-screen opacity-25 mix-blend-saturation transition-opacity duration-(--dur-ui) ease-(--ease-out) group-focus-within/project:opacity-0 group-hover/project:opacity-0 motion-reduce:transition-none"
        />
      </div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  )
}
