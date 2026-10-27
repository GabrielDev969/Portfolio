import type { BrowserContext, Page } from '@playwright/test'

export const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
]

export async function startInViewMode(context: BrowserContext, mode: 'film' | 'quick') {
  await context.addInitScript((m) => localStorage.setItem('viewMode', m), mode)
}

export async function ready(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

/**
 * For each [data-fact] element: whether it is fully inside the viewport, and whether the
 * element hit-tested at its center is itself (so no bar, overlay or menu covers it).
 */
export async function factVisibility(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-fact]')].map((el) => {
      const box = el.getBoundingClientRect()
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
      return {
        fact: el.dataset.fact,
        inViewport:
          box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth,
        uncovered: hit !== null && (hit === el || el.contains(hit)),
      }
    }),
  )
}
