import type { ReactNode } from 'react'

/**
 * Every mockup is drawn on one 1200 × 502 canvas (2.39:1) and cropped to fill its frame. On
 * phones the frame is 4:3, which keeps 670 units of the width: the middle (x 265–935) by
 * default, or the left edge (x 0–670) for a screen that reads from its title on the left.
 * Mockups are decorative: the frame carries a text description.
 */
const canvas = { width: 1200, height: 502 }

type Props = { children: ReactNode; crop?: 'middle' | 'left' }

export function MockupFrame({ children, crop = 'middle' }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      preserveAspectRatio={crop === 'left' ? 'xMinYMid slice' : 'xMidYMid slice'}
      className="block size-full font-text"
    >
      {children}
    </svg>
  )
}
