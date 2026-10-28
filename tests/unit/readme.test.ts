import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { readmeMarkers, todosMarkdown } from '../../scripts/list-todos'

describe('README.md', () => {
  it('lists the missing facts as they are now (run pnpm todos --readme)', () => {
    const readme = readFileSync(join(import.meta.dirname, '..', '..', 'README.md'), 'utf8')
    const [start, end] = readmeMarkers
    const section = readme.slice(readme.indexOf(start) + start.length, readme.indexOf(end))
    assert.equal(section.trim(), todosMarkdown().trim())
  })
})
