import type { BrowserContext, Page } from '@playwright/test'

export const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
]

export async function startInViewMode(context: BrowserContext, mode: 'full' | 'quick') {
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

/**
 * Wait until the page has settled: fonts loaded, and in the full view every scene mounted and
 * measured (html[data-motion="ready"]) and no section title still rising (data-revealing).
 */
export async function settled(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  const full = await page.evaluate(
    () =>
      'js' in document.documentElement.dataset && document.documentElement.dataset.view !== 'quick',
  )
  if (full) await page.locator('html[data-motion="ready"]').waitFor({ state: 'attached' })
  await page.waitForFunction(() => document.querySelectorAll('[data-revealing]').length === 0)
}

/**
 * Every element under `root` whose right edge passes the viewport, as
 * `selector "text" width W px, right edge R px (viewport V px)`, so a failure names its cause.
 * Elements inside `skip` (stills, the Act I track, decorative layers) are left out.
 */
export async function overflowing(page: Page, root: string, skip: string) {
  return page.evaluate(
    ([root, skip]) => {
      const selector = (el: Element) => {
        const parts: string[] = []
        for (
          let node: Element | null = el;
          node && node !== document.body;
          node = node.parentElement
        ) {
          const classes = [...node.classList]
            .slice(0, 3)
            .map((c) => `.${CSS.escape(c)}`)
            .join('')
          parts.unshift(`${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${classes}`)
          if (node.id) break
        }
        return parts.join(' > ')
      }
      return [...document.querySelectorAll(`${root} *`)]
        .filter((el) => !el.closest(skip))
        .map((el) => ({ el, box: el.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.right > innerWidth + 0.5)
        .map(({ el, box }) => {
          const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)
          return `${selector(el)} "${text}" width ${Math.round(box.width)} px, right edge ${Math.round(box.right)} px (viewport ${innerWidth} px)`
        })
    },
    [root, skip] as const,
  )
}
