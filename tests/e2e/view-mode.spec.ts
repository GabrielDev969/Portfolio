import { expect, test } from '@playwright/test'

test('Quick view switches in place, is remembered, and switches back', async ({ page }) => {
  await page.goto('en/')
  const html = page.locator('html')
  const toggle = page.getByRole('button', { name: 'Quick view' })

  await expect(html).toHaveAttribute('data-view', 'film')
  await toggle.click()
  await expect(html).toHaveAttribute('data-view', 'quick')
  await expect(page.getByRole('button', { name: 'Film view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('.bar-bottom')).toBeHidden()
  await expect(page.locator('.film-grain')).toBeHidden()

  await page.reload()
  await expect(html).toHaveAttribute('data-view', 'quick')

  await page.getByRole('button', { name: 'Film view' }).click()
  await expect(html).toHaveAttribute('data-view', 'film')
  await page.reload()
  await expect(html).toHaveAttribute('data-view', 'film')
})

test('both modes expose the same headings and links', async ({ browser }) => {
  const read = async (mode: 'film' | 'quick') => {
    const context = await browser.newContext()
    await context.addInitScript((m) => localStorage.setItem('viewMode', m), mode)
    const page = await context.newPage()
    await page.goto('en/')
    const headings = await page.getByRole('heading').allInnerTexts()
    const links = await page
      .locator('main a[href]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    await context.close()
    return { headings: headings.map((h) => h.toLowerCase()), links }
  }
  expect(await read('quick')).toEqual(await read('film'))
})
