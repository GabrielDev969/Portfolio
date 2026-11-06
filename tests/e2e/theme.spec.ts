import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { startInViewMode } from './helpers'

/** Relative luminance of an element's computed background (or text color), from its sRGB value. */
const luminance = (page: Page, selector: string, property: 'backgroundColor' | 'color') =>
  page.locator(selector).evaluate((el, property) => {
    // Let the browser resolve oklch() to sRGB through a canvas.
    const ctx = document.createElement('canvas').getContext('2d')!
    ctx.fillStyle = getComputedStyle(el)[property]
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = [...ctx.getImageData(0, 0, 1, 1).data].map((v) => {
      const c = v / 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
  }, property)
const groundLuminance = (page: Page, selector: string) =>
  luminance(page, selector, 'backgroundColor')

// design/COMMIT-SHEET.md §2: a dark ground on screen, a light one on paper.
for (const mode of ['full', 'quick'] as const) {
  test(`the ground is dark and the text light · ${mode}`, async ({ context, page }) => {
    await startInViewMode(context, mode)
    await page.goto('en/')
    expect(await groundLuminance(page, 'body')).toBeLessThan(0.02)
    expect(await groundLuminance(page, 'header.top-bar')).toBeLessThan(0.02)
    expect(await luminance(page, 'h1', 'color')).toBeGreaterThan(0.7)
  })
}

test('paper goes light', async ({ page }) => {
  await page.goto('en/')
  await page.emulateMedia({ media: 'print' })
  expect(await groundLuminance(page, 'body')).toBeGreaterThan(0.9)
})

// The mono face is the swarm's voice only (design/COMMIT-SHEET.md §3): no content is set in it.
test('no content is set in the mono face', async ({ page }) => {
  await page.goto('en/')
  const mono = await page.locator('main').evaluate((main) =>
    [...main.querySelectorAll('*')]
      .filter((el) => !el.closest('[aria-hidden="true"]'))
      .filter((el) => /mono/i.test(getComputedStyle(el).fontFamily))
      .map((el) => el.tagName.toLowerCase()),
  )
  expect(mono).toEqual([])
})
