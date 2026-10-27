import type { Page } from '@playwright/test'
import { expect, skipColdOpen, test } from './fixtures'
import { startInViewMode } from './helpers'

const toBottom = (page: Page) =>
  page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))

test('the end credits fade to black and close the bars', async ({ page }) => {
  await page.goto('en/')
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2))
  await expect(page.locator('html')).toHaveAttribute('data-bars', 'open')
  await toBottom(page)
  await expect(page.locator('html')).toHaveAttribute('data-bars', 'closed')
  await expect(page.locator('#contact')).toHaveCSS(
    'background-color',
    /rgb\(0, 0, 0\)|oklab\(0 0 0\)/,
  )
})

test('Rewind runs the reel back to the top and the first frame', async ({ page }) => {
  await page.goto('en/')
  await toBottom(page)
  await page.getByRole('link', { name: 'Rewind the reel' }).click()
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 4000 }).toBe(0)
  await expect(page.locator('.bar-bottom')).toContainText('00:00:00:00')
  await expect(page.locator('html')).toHaveAttribute('data-bars', 'closed')
  await expect(page.locator('main')).toBeFocused()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('Rewind jumps straight to the top', async ({ page }) => {
    await page.goto('en/')
    await toBottom(page)
    await page.getByRole('link', { name: 'Rewind the reel' }).click()
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })
})

test('Quick view keeps the contact facts and drops the film', async ({ browser }) => {
  const context = await browser.newContext()
  await skipColdOpen(context)
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.getByText('Directed by')).toBeHidden()
  await expect(page.getByText('Frontend')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Write to me' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Rewind the reel' })).toBeHidden()
  // The ground stays the screen colour: no fade to black.
  const background = await page
    .locator('#contact')
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(background).not.toMatch(/rgb\(0, 0, 0\)|oklab\(0 0 0\)/)
  await context.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Rewind is a link to the top, and Write to me opens an email', async ({ page }) => {
    await page.goto('en/')
    await expect(page.getByRole('link', { name: 'Rewind the reel' })).toHaveAttribute(
      'href',
      '#top',
    )
    await expect(page.getByRole('link', { name: 'Write to me' })).toHaveAttribute(
      'href',
      'mailto:gabriel.dev969@gmail.com',
    )
  })
})
