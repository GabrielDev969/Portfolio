import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The color tokens of src/app/globals.css and the math to compare them, shared by
 * tests/unit/contrast.test.ts and scripts/build-facts.ts, so the swarm shows the same ratios
 * the test enforces.
 */
const css = readFileSync(join(import.meta.dirname, '../../src/app/globals.css'), 'utf8')

export type Oklch = [l: number, c: number, h: number]

/** A token's OKLCH value, as the @theme block declares it (the first, on-screen value). */
export function token(name: string): Oklch {
  const match = css.match(
    new RegExp(`--color-${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`),
  )
  if (!match) throw new Error(`token --color-${name} not found`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/** OKLCH → linear sRGB (Björn Ottosson's matrices), clamped to the gamut. */
function linearRgb([l, c, h]: Oklch) {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(Math.max(v, 0), 1)) as [number, number, number]
}

function luminance(name: string) {
  const [r, g, b] = linearRgb(token(name))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two tokens. */
export function contrast(fg: string, bg: string) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** How far apart two tokens look, in OKLab (0 = the same, about 0.02 = just noticeable). */
export function distance(a: string, b: string) {
  const lab = (name: string) => {
    const [l, c, h] = token(name)
    return [l, c * Math.cos((h * Math.PI) / 180), c * Math.sin((h * Math.PI) / 180)] as const
  }
  const [p, q] = [lab(a), lab(b)]
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

export const agentTokens = Array.from({ length: 16 }, (_, i) => `agent-${i + 1}`)
