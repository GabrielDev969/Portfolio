import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { factVisibility, ready } from './helpers'

test.use({ intro: true })

const overlay = (page: Page) => page.locator('.cold-open')

/** Milliseconds from navigation start until the overlay is no longer visible, measured in-page. */
function msUntilCut(page: Page) {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const el = document.querySelector('.cold-open')!
        const check = () => {
          const style = getComputedStyle(el)
          if (style.display === 'none' || style.visibility === 'hidden') resolve(performance.now())
          else requestAnimationFrame(check)
        }
        check()
      }),
  )
}

test('plays on the first visit and cuts to the hero within 1.5 s', async ({ page }) => {
  await page.goto('en/', { waitUntil: 'commit' })
  await expect(overlay(page)).toBeVisible()
  expect(await msUntilCut(page)).toBeLessThanOrEqual(1500)
  await ready(page)
  for (const f of await factVisibility(page)) {
    expect(f, f.fact).toMatchObject({ inViewport: true, uncovered: true })
  }
})

test('"Skip intro" is the first focusable element and ends it at once', async ({ page }) => {
  await page.goto('en/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('button', { name: 'Skip intro' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(overlay(page)).toBeHidden()
  await expect(page.locator('html')).not.toHaveAttribute('data-intro')
})

test('Esc ends it', async ({ page }) => {
  await page.goto('en/')
  await expect(overlay(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(overlay(page)).toBeHidden()
})

test('plays once per session', async ({ page }) => {
  await page.goto('en/')
  await expect(overlay(page)).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).not.toHaveAttribute('data-intro')
  await expect(overlay(page)).toBeHidden()
})

test('a deep link skips it and lands on its section', async ({ page }) => {
  await page.goto('en/#projects')
  await expect(page.locator('html')).not.toHaveAttribute('data-intro')
  await expect(overlay(page)).toBeHidden()
  await expect(page.locator('#projects')).toBeInViewport()
})

test('Quick view skips it', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('viewMode', 'quick'))
  await page.goto('en/')
  await expect(overlay(page)).toBeHidden()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('it never plays', async ({ page }) => {
    await page.goto('en/')
    await expect(page.locator('html')).not.toHaveAttribute('data-intro')
    await expect(overlay(page)).toBeHidden()
  })
})
