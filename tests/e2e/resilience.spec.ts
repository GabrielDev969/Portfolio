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

test('the first Tab reaches "Skip to content", which moves focus to the main content', async ({
  page,
}) => {
  await page.goto('en/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('printing gives Quick view on paper and returns to the full page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('en/')
  // Let every scene run first, as for a reader who prints from the end credits.
  await page.keyboard.press('End')
  await expect(page.locator('#contact')).toBeInViewport()

  await page.evaluate(() => dispatchEvent(new Event('beforeprint')))
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('html')).toHaveAttribute('data-view', 'quick')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  for (const heading of await page.getByRole('heading', { level: 2 }).all()) {
    await expect(heading).toBeVisible()
    expect(
      await heading.evaluate((el) => el.querySelector('span span')?.getAttribute('style') ?? ''),
    ).not.toMatch(/translate/)
  }
  await expect(page.locator('header.top-bar')).toBeHidden()
  const contact = page.locator('[data-fact="contact"]')
  expect(await contact.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('1px')

  await page.emulateMedia({ media: 'screen' })
  await page.evaluate(() => dispatchEvent(new Event('afterprint')))
  await expect(page.locator('html')).toHaveAttribute('data-view', 'full')
  expect(await page.evaluate(() => localStorage.getItem('viewMode'))).toBeNull()
})

test('every locale offers its own CV, and the file is there', async ({ page, request }) => {
  for (const locale of ['pt', 'en', 'es']) {
    await page.goto(`${locale}/`)
    const hrefs = await page
      .locator('a[download]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
    // Hero and end credits, both to this locale's PDF.
    expect(hrefs, locale).toEqual(
      Array(2).fill(`/Portfolio/cv/CV_Gabriel_Santos_${locale.toUpperCase()}.pdf`),
    )
    const response = await request.get(hrefs[0]!)
    expect(response.status(), hrefs[0]).toBe(200)
    expect(response.headers()['content-type'], hrefs[0]).toBe('application/pdf')
  }
})
