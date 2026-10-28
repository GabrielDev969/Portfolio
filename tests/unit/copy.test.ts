import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { renderCopy } from '../../scripts/export-copy'
import { locales } from '../../src/lib/i18n'

describe('design/copy', () => {
  for (const locale of locales) {
    it(`${locale}.txt matches the content (run pnpm copy)`, () => {
      const file = join(import.meta.dirname, '..', '..', 'design', 'copy', `${locale}.txt`)
      assert.equal(readFileSync(file, 'utf8'), renderCopy(locale))
    })
  }
})
