import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { sections } from '../../scripts/build-facts'
import { getContent } from '../../src/content'
import { locales } from '../../src/lib/i18n'

// design/COMMIT-SHEET.md §6 and its non-negotiables: sixteen agents with role names, no
// third-party product named in the swarm, and facts read from the repo, not typed in.
describe('swarm', () => {
  for (const locale of locales) {
    const { swarm, projects, skills } = getContent(locale)

    it(`${locale}: sixteen agents, Gabriel last`, () => {
      assert.equal(swarm.agents.length, 16)
      assert.equal(swarm.agents.at(-1), 'Gabriel')
      assert.equal(new Set(swarm.agents).size, 16)
    })

    it(`${locale}: its words name no product from the stack`, () => {
      const products = [
        ...projects.flatMap((p) => p.stack),
        ...skills.stack.flatMap((g) => g.items),
      ].filter((p): p is string => typeof p === 'string')
      const words = JSON.stringify(swarm)
      const named = products.filter((p) =>
        new RegExp(`(?<![\\w-])${p.replace(/[.()]/g, '\\$&')}(?![\\w-])`).test(words),
      )
      assert.deepEqual(named, [])
    })
  }

  it('reads the sections from the page, in order, each with its component', () => {
    const found = sections()
    assert.deepEqual(
      found.map((s) => s.id),
      ['top', 'experience', 'projects', 'how-i-work', 'contact'],
    )
    for (const { file } of found) {
      assert.ok(existsSync(join(import.meta.dirname, '../../src/components/sections', file)), file)
    }
  })
})
