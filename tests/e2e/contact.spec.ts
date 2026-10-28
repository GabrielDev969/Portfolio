import { expect, test } from './fixtures'
import { startInViewMode } from './helpers'

test('contact is a normal section on the page ground, with every way to reach Gabriel', async ({
  page,
}) => {
  await page.goto('en/#contact')
  const contact = page.locator('#contact')
  const ground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const background = await contact.evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(['rgba(0, 0, 0, 0)', ground]).toContain(background)
  await expect(contact.getByText('Available for new projects')).toBeVisible()
  await expect(contact.getByRole('link', { name: 'Write to me' })).toHaveAttribute(
    'href',
    'mailto:gabriel.dev969@gmail.com',
  )
  for (const name of ['LinkedIn', 'GitHub', 'Download CV']) {
    await expect(contact.getByRole('link', { name })).toBeVisible()
  }
  await expect(contact.getByText('Frontend')).toBeVisible()
  await expect(contact.getByText('Languages')).toBeVisible()
})

test('Back to top returns to the hero', async ({ page }) => {
  await page.goto('en/')
  await page.locator('html[data-motion="ready"]').waitFor({ state: 'attached' })
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
  await page.getByRole('link', { name: 'Back to top' }).click()
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 4000 }).toBe(0)
  await expect(page.locator('#hero-name')).toBeInViewport()
})

test('Quick view keeps the contact facts and drops the photo', async ({ browser }) => {
  const context = await browser.newContext()
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('#contact .contact-photo')).toBeHidden()
  await expect(page.locator('#contact').getByText('Frontend')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Write to me' })).toBeVisible()
  await context.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Back to top is a link to the top, and Write to me opens an email', async ({ page }) => {
    await page.goto('en/')
    await expect(page.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#top')
    await expect(page.getByRole('link', { name: 'Write to me' })).toHaveAttribute(
      'href',
      'mailto:gabriel.dev969@gmail.com',
    )
  })
})
