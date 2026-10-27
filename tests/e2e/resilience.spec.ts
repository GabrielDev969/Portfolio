import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every section and fact is readable', async ({ page }) => {
    await page.goto('en/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Gabriel\s*Santos/i)
    for (const name of ['Experience', 'Projects', 'How I work', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()
    }
    await expect(page.getByText('Remote.')).toBeVisible()
    // Quick view needs JS to remember the choice, so it is not offered.
    await expect(page.getByRole('button', { name: 'Quick view' })).toBeHidden()
  })
})

test('only the Spanish page mentions relocation', async ({ page }) => {
  await page.goto('es/')
  await expect(page.getByText('Santiago, Chile').first()).toBeVisible()
  for (const locale of ['pt', 'en']) {
    await page.goto(`${locale}/`)
    await expect(page.getByText(/Santiago|Chile/)).toHaveCount(0)
  }
})

test('every external link opens safely', async ({ page }) => {
  await page.goto('en/')
  const unsafe = await page
    .locator('a[href^="http"]')
    .evaluateAll((as) =>
      as
        .filter(
          (a) =>
            !/noopener/.test(a.getAttribute('rel') ?? '') ||
            !/noreferrer/.test(a.getAttribute('rel') ?? ''),
        )
        .map((a) => a.getAttribute('href')),
    )
  expect(unsafe).toEqual([])
})

for (const mode of ['film', 'quick'] as const) {
  test(`axe finds no serious or critical violations · ${mode}`, async ({ page }) => {
    await page.addInitScript((m) => localStorage.setItem('viewMode', m), mode)
    await page.goto('en/')
    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
}

test('the first Tab reaches "Skip to content", which moves focus to the main content', async ({
  page,
}) => {
  await page.goto('en/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})
