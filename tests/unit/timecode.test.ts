import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatTimecode } from '../../src/lib/timecode'

describe('formatTimecode', () => {
  it('starts at zero and ends at the runtime', () => {
    assert.equal(formatTimecode(0, 24, 180), '00:00:00:00')
    assert.equal(formatTimecode(1, 24, 180), '00:03:00:00')
  })

  it('counts frames, seconds and minutes', () => {
    // 0.5 of 180 s = 90 s = 1 min 30 s
    assert.equal(formatTimecode(0.5, 24, 180), '00:01:30:00')
    // 1 frame of 4320
    assert.equal(formatTimecode(1 / 4320, 24, 180), '00:00:00:01')
    assert.equal(formatTimecode(25 / 4320, 24, 180), '00:00:01:01')
  })

  it('clamps progress outside 0–1', () => {
    assert.equal(formatTimecode(-0.2, 24, 180), '00:00:00:00')
    assert.equal(formatTimecode(1.4, 24, 180), '00:03:00:00')
  })

  it('reaches hours on long runtimes', () => {
    assert.equal(formatTimecode(1, 24, 3725), '01:02:05:00')
  })
})
