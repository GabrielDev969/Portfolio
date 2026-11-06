import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'

// Reads the color tokens straight from globals.css, so a token change cannot skip the check.
const css = readFileSync(join(import.meta.dirname, '../../src/app/globals.css'), 'utf8')

function token(name: string): [number, number, number] {
  const match = css.match(
    new RegExp(`--color-${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`),
  )
  assert.ok(match, `token --color-${name} not found`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/** OKLCH → linear sRGB (Björn Ottosson's matrices), clamped to the gamut. */
function linearRgb([l, c, h]: [number, number, number]) {
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

function contrast(fg: string, bg: string) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** OKLab coordinates, for how far apart two colors look (0 = the same, ~0.02 = just noticeable). */
function oklab(name: string) {
  const [l, c, h] = token(name)
  return [l, c * Math.cos((h * Math.PI) / 180), c * Math.sin((h * Math.PI) / 180)] as const
}

function distance(a: string, b: string) {
  const [p, q] = [oklab(a), oklab(b)]
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

// Every pairing the design sets text in (design/COMMIT-SHEET.md §2). AA body text: 4.5:1.
const pairings: [fg: string, bg: string, min: number][] = [
  ['ink', 'screen', 4.5],
  ['ink', 'screen-2', 4.5],
  ['ink-2', 'screen', 4.5],
  ['ink-2', 'screen-2', 4.5],
  // Crimson is text too: Hi I'm, the badges, the primary button's label.
  ['crimson', 'screen', 4.5],
  ['crimson', 'screen-2', 4.5],
  // Copy: dark text on a crimson button.
  ['screen', 'crimson', 4.5],
  ['screen', 'ink', 4.5],
  // Focus outlines and selection, against the ground: WCAG's 3:1 for UI.
  ['cyan', 'screen', 3],
]

const agents = Array.from({ length: 16 }, (_, i) => `agent-${i + 1}`)

describe('color contrast', () => {
  for (const [fg, bg, min] of pairings) {
    it(`${fg} on ${bg} is at least ${min}:1`, () => {
      const ratio = contrast(fg, bg)
      assert.ok(ratio >= min, `${ratio.toFixed(2)}:1`)
    })
  }
})

// The swarm (design/COMMIT-SHEET.md §2): cursors and outlines read on the ground, each label is
// dark text on its agent's pill, and no two agents, nor an agent and the contact accent, look alike.
describe('agent colors', () => {
  for (const agent of agents) {
    it(`${agent}: at least 3:1 on both grounds, label text at least 4.5:1 on its pill`, () => {
      for (const ground of ['screen', 'screen-2']) {
        const ratio = contrast(agent, ground)
        assert.ok(ratio >= 3, `${ground}: ${ratio.toFixed(2)}:1`)
      }
      const label = contrast('screen', agent)
      assert.ok(label >= 4.5, `label: ${label.toFixed(2)}:1`)
    })
  }

  it('any two agents are at least 0.07 apart in OKLab', () => {
    const close: string[] = []
    for (const [i, a] of agents.entries()) {
      for (const b of agents.slice(i + 1)) {
        if (distance(a, b) < 0.07) close.push(`${a} / ${b}: ${distance(a, b).toFixed(3)}`)
      }
    }
    assert.deepEqual(close, [])
  })

  it('no agent looks like the contact accent (at least 0.08 apart)', () => {
    const close = agents.filter((a) => distance(a, 'crimson') < 0.08)
    assert.deepEqual(close, [])
  })
})
