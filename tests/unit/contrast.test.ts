import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { agentTokens as agents, contrast, distance } from '../../scripts/lib/color'

// The tokens are read straight from globals.css (scripts/lib/color.ts), so a token change
// cannot skip the check.

// Every pairing the design sets text in (design/COMMIT-SHEET.md §2). AA body text: 4.5:1.
const pairings: [fg: string, bg: string, min: number][] = [
  ['ink', 'screen', 4.5],
  ['ink', 'screen-2', 4.5],
  ['ink-2', 'screen', 4.5],
  ['ink-2', 'screen-2', 4.5],
  // Crimson is text too: Hi I'm, the badges, the primary button's label.
  ['accent', 'screen', 4.5],
  ['accent', 'screen-2', 4.5],
  // Copy: dark text on a accent button.
  ['screen', 'accent', 4.5],
  ['screen', 'ink', 4.5],
  // Focus outlines and selection, against the ground: WCAG's 3:1 for UI.
  ['cyan', 'screen', 3],
]

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
    const close = agents.filter((a) => distance(a, 'accent') < 0.08)
    assert.deepEqual(close, [])
  })
})
