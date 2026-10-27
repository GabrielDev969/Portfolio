import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getContent } from '../../src/content'
import { isTodo } from '../../src/content/schema'
import { locales } from '../../src/lib/i18n'

/** The shape of a value with every leaf replaced by its type, so locales can be compared. */
function shape(value: unknown): unknown {
  if (isTodo(value)) return 'text'
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'relocation')
        .map(([key, v]) => [key, shape(v)]),
    )
  }
  return typeof value === 'string' ? 'text' : typeof value
}

describe('content', () => {
  it('every locale has the same shape as English', () => {
    const reference = shape(getContent('en'))
    for (const locale of locales) assert.deepEqual(shape(getContent(locale)), reference, locale)
  })

  it('only Spanish mentions relocation', () => {
    assert.ok(getContent('es').person.relocation)
    assert.equal(getContent('pt').person.relocation, undefined)
    assert.equal(getContent('en').person.relocation, undefined)
    for (const locale of ['pt', 'en'] as const) {
      assert.doesNotMatch(JSON.stringify(getContent(locale)), /Santiago|Chile/, locale)
    }
  })

  it('the CV points to the file for its own locale', () => {
    for (const locale of locales) {
      assert.equal(
        getContent(locale).contact.cv.href,
        `cv/CV_Gabriel_Santos_${locale.toUpperCase()}.pdf`,
      )
    }
  })

  for (const project of getContent('en').projects) {
    describe(project.title, () => {
      const bts = project.behindTheScenes

      it('has two or three key decisions', () => {
        assert.ok(bts.decisions.length >= 2 && bts.decisions.length <= 3, `${bts.decisions.length}`)
      })

      it('has an architecture whose edges join existing nodes', () => {
        const ids = new Set(bts.architecture.nodes.map((n) => n.id))
        assert.ok(ids.size >= 2)
        for (const edge of bts.architecture.edges) {
          assert.ok(ids.has(edge.from) && ids.has(edge.to), `${edge.from} → ${edge.to}`)
        }
      })

      if (project.internal) {
        it('as an internal system, has no links and a fictional still', () => {
          assert.deepEqual(project.links, { kind: 'internal' })
          assert.equal(project.still.kind, 'mockup')
        })
      }

      it('opens every external link safely', () => {
        if (isTodo(project.links) || project.links.kind === 'internal') return
        for (const link of project.links.links) assert.match(link.href, /^https:\/\//)
      })
    })
  }
})
