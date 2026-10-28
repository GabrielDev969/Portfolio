/**
 * The only place motion values live (design/COMMIT-SHEET.md §5).
 * GSAP reads the objects; CSS reads the same values through `motionCssVars`, set on <html>.
 */
export const ease = {
  out: 'power3.out',
  expo: 'expo.out',
  push: 'power2.out',
  none: 'none',
} as const

/** Seconds. */
export const dur = {
  ui: 0.22,
  fade: 0.3,
  reveal: 1.1,
  rewind: 1.6,
} as const

export const stagger = { lines: 0.06, credits: 0.05 } as const

export const scrub = 0.6

export const smoothScroll = { lerp: 0.12 } as const

/** CSS equivalents of the GSAP eases, for transitions that CSS runs. */
const cssEase = {
  out: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // power3.out
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)', // expo.out
}

export const motionCssVars = {
  '--dur-ui': `${dur.ui * 1000}ms`,
  '--dur-fade': `${dur.fade * 1000}ms`,
  '--dur-reveal': `${dur.reveal * 1000}ms`,
  '--stagger-lines': `${stagger.lines * 1000}ms`,
  '--ease-out': cssEase.out,
  '--ease-expo': cssEase.expo,
} as const
