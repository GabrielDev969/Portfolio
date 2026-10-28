import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** What the frame shows, for screen readers when the picture itself is decorative. */
  description: string
  className?: string
}

/**
 * A project image in a plain frame: the tone step with a hairline around one crop ratio for
 * the whole set (12:5, the canvas the mockups are drawn on; 4:3 on phones), so a light
 * screenshot never melts into the light page.
 */
export function ProjectFrame({ children, description, className = '' }: Props) {
  return (
    <figure className={`border border-ink/15 bg-screen-2 p-[clamp(8px,1.1vw,16px)] ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[1200/502]">{children}</div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  )
}
