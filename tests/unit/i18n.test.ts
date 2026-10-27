import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isLocale, matchLocale } from '../../src/lib/i18n'

describe('matchLocale', () => {
  it('maps Portuguese and Spanish variants to their locale', () => {
    assert.equal(matchLocale(['pt-BR']), 'pt')
    assert.equal(matchLocale(['pt-PT']), 'pt')
    assert.equal(matchLocale(['es-CL']), 'es')
    assert.equal(matchLocale(['ES']), 'es')
  })

  it('falls back to English', () => {
    assert.equal(matchLocale(['fr-FR']), 'en')
    assert.equal(matchLocale([]), 'en')
  })

  it('takes the first supported language in the browser list', () => {
    assert.equal(matchLocale(['fr-FR', 'es-AR', 'en']), 'es')
    assert.equal(matchLocale(['en-US', 'pt-BR']), 'en')
  })
})

describe('isLocale', () => {
  it('accepts only the three site locales', () => {
    assert.ok(isLocale('pt') && isLocale('en') && isLocale('es'))
    assert.ok(!isLocale('fr') && !isLocale('') && !isLocale(undefined))
  })
})
