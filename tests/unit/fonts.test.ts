import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getContent } from '../../src/content'
import { mockupCopy } from '../../src/components/mockups/copy'
import { locales } from '../../src/lib/i18n'

// The fonts load the Google "latin" subset only (src/app/fonts.ts). Its ranges, as served:
const latin = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
]
// Set in the fallback font on purpose: the arrows of the workflow and diagram captions.
const allowed = new Set(['→'])

describe('fonts', () => {
  it('the latin subset covers every letter on the page', () => {
    const text = JSON.stringify(locales.map((l) => [getContent(l), mockupCopy[l]]))
    const outside = [...new Set(text)].filter((ch) => {
      const code = ch.codePointAt(0)!
      return !allowed.has(ch) && !latin.some(([a, b]) => code >= a! && code <= b!)
    })
    assert.deepEqual(outside, [])
  })
})
