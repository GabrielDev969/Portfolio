import { expect, test } from './fixtures'

test('Quick view switches in place, is remembered, and switches back', async ({ page }) => {
  await page.goto('en/')
  const html = page.locator('html')
  const toggle = page.getByRole('button', { name: 'Quick view' })

  await expect(html).toHaveAttribute('data-view', 'full')
  await toggle.click()
  await expect(html).toHaveAttribute('data-view', 'quick')
  await expect(page.getByRole('button', { name: 'Full view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  await page.reload()
  await expect(html).toHaveAttribute('data-view', 'quick')

  await page.getByRole('button', { name: 'Full view' }).click()
  await expect(html).toHaveAttribute('data-view', 'full')
  await page.reload()
  await expect(html).toHaveAttribute('data-view', 'full')
})

test('both modes expose the same headings and links', async ({ browser }) => {
  const read = async (mode: 'full' | 'quick') => {
    const context = await browser.newContext()
    await context.addInitScript((m) => localStorage.setItem('viewMode', m), mode)
    const page = await context.newPage()
    await page.goto('en/')
    // Behind-the-scenes parts are inline in Quick view but wait in a closed drawer in the full view
    // mode; tests/e2e/projects.spec.ts checks that both hold the same parts.
    const headings = await page
      .getByRole('heading')
      .filter({
        hasNot: page.locator('xpath=self::*[ancestor::*[contains(@class,"details-parts")]]'),
      })
      .allInnerTexts()
    const links = await page
      .locator('main a[href]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    await context.close()
    return { headings: headings.map((h) => h.toLowerCase()), links }
  }
  expect(await read('quick')).toEqual(await read('full'))
})
