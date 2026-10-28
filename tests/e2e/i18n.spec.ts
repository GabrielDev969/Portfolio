import AxeBuilder from '@axe-core/playwright'
import { getContent } from '../../src/content'
import { isTodo } from '../../src/content/schema'
import { languageTags, locales } from '../../src/lib/i18n'
import { expect, test } from './fixtures'
import { overflowing, settled, startInViewMode, viewports } from './helpers'

/** English sentences of three words or more: none may show on a translated page. */
function englishPhrases() {
  const out = new Set<string>()
  const walk = (value: unknown, key = ''): void => {
    if (isTodo(value) || /^(name|names|organization|email|href|title)$/.test(key)) return
    if (typeof value === 'string' && value.split(' ').length >= 3) out.add(value)
    else if (Array.isArray(value)) value.forEach((v) => walk(v, key))
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, k)
    }
  }
  walk(getContent('en'))
  return [...out]
}

for (const locale of locales) {
  for (const mode of ['film', 'quick'] as const) {
    test(`axe finds no serious or critical violations · ${locale} · ${mode}`, async ({
      context,
      page,
    }) => {
      await startInViewMode(context, mode)
      await page.goto(`${locale}/`)
      await expect(page.locator('html')).toHaveAttribute('lang', languageTags[locale])
      const { violations } = await new AxeBuilder({ page }).analyze()
      const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([])
    })
  }

  test(`axe passes with a behind-the-scenes drawer open · ${locale}`, async ({ page }) => {
    const { ui } = getContent(locale)
    await page.goto(`${locale}/`)
    await page.locator('#zibby').getByRole('button', { name: ui.behindTheScenes }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    const { violations } = await new AxeBuilder({ page }).include('dialog[open]').analyze()
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })

  if (locale !== 'en') {
    test(`no English sentence is left on the page · ${locale}`, async ({ context, page }) => {
      // Quick view lays every behind-the-scenes panel inline, so their text is on the page too.
      await startInViewMode(context, 'quick')
      await page.goto(`${locale}/`)
      const text = await page.locator('body').innerText()
      const head = await page.locator('head').innerHTML()
      expect(englishPhrases().filter((s) => text.includes(s) || head.includes(s))).toEqual([])
    })
  }
}

test.describe('the root picks a language', () => {
  for (const [languages, expected] of [
    [['pt-BR', 'en'], 'pt'],
    [['es-CL'], 'es'],
    [['fr-FR'], 'en'],
  ] as const) {
    test(`from the browser: ${languages[0]} → ${expected}`, async ({ browser }) => {
      const context = await browser.newContext({ locale: languages[0] })
      const page = await context.newPage()
      await page.goto('./')
      await expect(page).toHaveURL(new RegExp(`/Portfolio/${expected}/$`))
      await context.close()
    })
  }

  test('a saved choice wins over the browser, and the hash is kept', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'pt-BR' })
    await context.addInitScript(() => localStorage.setItem('locale', 'es'))
    const page = await context.newPage()
    await page.goto('./#contact')
    await expect(page).toHaveURL(/\/Portfolio\/es\/#contact$/)
    await context.close()
  })
})

test('the language switcher keeps the section and remembers the choice', async ({ page }) => {
  await page.goto('en/#projects')
  await page
    .getByRole('navigation', { name: getContent('en').ui.languageNav })
    .getByText('pt')
    .click()
  await expect(page).toHaveURL(/\/Portfolio\/pt\/#projects$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('pt')
  await page.goto('')
  await expect(page).toHaveURL(/\/Portfolio\/pt\/$/)
})

for (const locale of locales) {
  test(`the top bar fits a 360 px phone · ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 })
    await page.goto(`${locale}/`)
    await settled(page)
    const wide = await overflowing(page, 'header.bar-top', '.sr-only')
    expect(wide, `Wider than the screen:\n${wide.join('\n')}`).toEqual([])
  })
}

for (const locale of locales) {
  for (const width of [360, 390, 768, 1024]) {
    test(`no sideways scroll at ${width} px · ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`${locale}/`)
      await settled(page)
      const wide = await overflowing(
        page,
        'main',
        '.project-still, .strip-track, [aria-hidden="true"]',
      )
      expect(wide, `Wider than the screen:\n${wide.join('\n')}`).toEqual([])
    })
  }
}

for (const locale of locales) {
  test(`the hero line clears the bars at every hero viewport · ${locale}`, async ({ page }) => {
    for (const viewport of [...viewports, { width: 768, height: 900 }]) {
      await page.setViewportSize(viewport)
      await page.goto(`${locale}/`)
      await page.evaluate(() => document.fonts.ready)
      const { line, bar } = await page.evaluate(() => ({
        line: document.querySelector('#top > p.font-text')!.getBoundingClientRect().bottom,
        bar: document.querySelector('.bar-bottom')!.getBoundingClientRect().top,
      }))
      expect(line, `${viewport.width}×${viewport.height}`).toBeLessThanOrEqual(bar)
    }
  })
}
