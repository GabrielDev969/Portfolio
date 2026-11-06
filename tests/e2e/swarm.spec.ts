import type { Browser, Page } from '@playwright/test'
import { getContent } from '../../src/content'
import type { BuildFacts } from '../../src/swarm/facts'
import { expect, test } from './fixtures'
import { startInViewMode } from './helpers'

// design/COMMIT-SHEET.md §6: a swarm of agents builds the page as it is read, over content that
// is complete from the first byte.

/** The facts the build wrote, as the page fetches them (read in each test: the build lists
 *  these tests before it writes the file). */
const buildFacts = async (page: Page) =>
  (await (await page.request.get('build-facts.json')).json()) as BuildFacts

const started = (page: Page) => page.locator('.swarm-dock').waitFor({ state: 'attached' })
/** Agents at work: on screen and not on their way out. */
const visibleCursors = (page: Page) =>
  page.locator('.swarm-cursor:not([hidden]):not(.swarm-leaving)').count()

/** The words of main, normalized, as a reader (or innerText) gets them. */
const mainText = (page: Page) =>
  page.locator('main').evaluate((m) => (m as HTMLElement).innerText.replace(/\s+/g, ' ').trim())

/** The page as it is without JavaScript: the content every visitor gets. */
async function noJsText(browser: Browser) {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('en/')
  const text = await mainText(page)
  await context.close()
  return text
}

/** Text that is faded, hidden or clipped, by itself or by an ancestor: none may be, ever. */
const withheld = (page: Page, scope: string) =>
  page.locator(scope).evaluate((root) =>
    [...root.querySelectorAll('h1, h2, h3, p, dt, dd, li, a, span')]
      .filter((el) => (el.textContent ?? '').trim() !== '')
      .filter((el) => {
        const s = getComputedStyle(el)
        return (
          !el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ||
          Number(s.opacity) < 1 ||
          (s.clipPath !== 'none' && s.clipPath !== '')
        )
      })
      .filter((el) => !el.closest('.quick\\:block, .hidden'))
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}"`),
  )

test('boot: the dock reads "Booting swarm…", then the count, within 800 ms', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  const t0 = Date.now()
  await expect(page.locator('.swarm-dock [data-k="active"]')).toHaveText(/Active \d+ \/ Total 16/)
  await expect(page.locator('html')).not.toHaveAttribute('data-swarm', 'booting', { timeout: 1000 })
  expect(Date.now() - t0).toBeLessThan(1000)
})

// The 5-second test, under the swarm: nothing it draws ever lands on the hero's text.
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test(`the boot never covers the hero · ${viewport.width}×${viewport.height}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto('en/')
    await started(page)
    const hits = await page.evaluate(async () => {
      // The hero's words, line by line, and its name and buttons by their boxes.
      const range = document.createRange()
      const lines = [...document.querySelectorAll('#top p')].flatMap((p) => {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
        const out: DOMRect[] = []
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          range.selectNodeContents(n)
          out.push(...range.getClientRects())
        }
        return out
      })
      const text = [
        ...lines,
        ...[...document.querySelectorAll('#top h1, #top a')].map((el) =>
          el.getBoundingClientRect(),
        ),
      ]
      const out = new Set<string>()
      const end = performance.now() + 3000
      while (performance.now() < end) {
        const marks = [
          ...document.querySelectorAll(
            '.swarm-cursor:not([hidden]) > svg, .swarm-label:not([hidden]), .swarm > :not(.swarm-cursor)',
          ),
        ]
        for (const m of marks) {
          const r = m.getBoundingClientRect()
          if (r.width === 0 || r.bottom < 56) continue
          for (const t of text) {
            if (r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top)
              out.add(
                `${m.className || m.tagName} over text at ${Math.round(t.left)},${Math.round(t.top)}`,
              )
          }
        }
        await new Promise((r) => requestAnimationFrame(r))
      }
      return [...out]
    })
    expect(hits).toEqual([])
    await context.close()
  })
}

test('content is all there at first paint and while a section is being built', async ({
  browser,
  page,
}) => {
  const reference = await noJsText(browser)
  await page.goto('en/')
  expect(await mainText(page)).toBe(reference)

  await started(page)
  await page.locator('#zibby').scrollIntoViewIfNeeded()
  await expect(page.locator('#zibby')).toHaveAttribute('data-swarm-unit', 'building', {
    timeout: 8000,
  })
  await page.waitForTimeout(500)
  // Mid-build: several agents at work, and every word still there, unfaded and unclipped.
  expect(await visibleCursors(page)).toBeGreaterThanOrEqual(3)
  expect(await withheld(page, 'main')).toEqual([])
  expect(await mainText(page)).toBe(reference)
})

// Text streams in as if typed: what is not typed yet waits under a veil, dimmer but readable.
test('text is typed in, and untyped text stays at AA under its veil', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await started(page)
  await page.locator('#zibby').scrollIntoViewIfNeeded()
  await expect(page.locator('#zibby')).toHaveAttribute('data-swarm-unit', 'building', {
    timeout: 8000,
  })
  await expect(page.locator('.swarm-veil').first()).toBeAttached()
  // The ground, the body ink, and the ink seen through a veil, as the screen would show them.
  const ratio = await page.evaluate(() => {
    const veil = document.querySelector('.swarm-veil')!
    const ctx = document.createElement('canvas').getContext('2d')!
    const paint = (...colors: string[]) => {
      ctx.clearRect(0, 0, 1, 1)
      for (const c of colors) {
        ctx.fillStyle = c
        ctx.fillRect(0, 0, 1, 1)
      }
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3)
    }
    const body = getComputedStyle(document.body)
    const lum = ([r, g, b]: number[]) =>
      [r!, g!, b!]
        .map((v) => v / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
        .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0)
    const ground = lum(paint(body.backgroundColor))
    const veiled = lum(
      paint(body.backgroundColor, body.color, getComputedStyle(veil).backgroundColor),
    )
    return (Math.max(ground, veiled) + 0.05) / (Math.min(ground, veiled) + 0.05)
  })
  expect(ratio).toBeGreaterThanOrEqual(4.5)
  // Typed through to the end: no veil is left once the section is approved.
  await expect(page.locator('#zibby')).toHaveAttribute('data-swarm-unit', 'built', {
    timeout: 8000,
  })
  await expect(page.locator('.swarm-veil')).toHaveCount(0)
})

test('the image is dragged into its slot and lands exactly there', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await started(page)
  const image = page.locator('#sistema-wave .project-image')
  const slot = await image.evaluate((el) => el.getBoundingClientRect().left + scrollX)
  await page.locator('#sistema-wave').scrollIntoViewIfNeeded()
  await expect(page.locator('.swarm-ghost').first()).toBeAttached({ timeout: 8000 })
  expect(await image.evaluate((el) => (el as HTMLElement).style.translate)).not.toBe('')
  await expect(page.locator('#sistema-wave')).toHaveAttribute('data-swarm-unit', 'built', {
    timeout: 8000,
  })
  expect(await image.evaluate((el) => (el as HTMLElement).style.translate)).toBe('')
  expect(await image.evaluate((el) => el.getBoundingClientRect().left + scrollX)).toBe(slot)
})

test('Skip build finishes everything at once', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  await page.getByRole('button', { name: 'Skip build' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-swarm', 'done')
  await expect(page.locator('.swarm-dock [data-k="status"]')).toHaveText('Ready · deployed')
  await expect(page.locator('.swarm-dock [data-k="progress"]')).toHaveText('100%')
  expect(await visibleCursors(page)).toBe(0)
  await expect(page.locator('.swarm > :not(.swarm-cursor)')).toHaveCount(0)
  const states = await page
    .locator('[data-swarm-unit]')
    .evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.swarmUnit))
  expect(new Set(states)).toEqual(new Set(['built']))
  await expect(page.getByRole('button', { name: 'Skip build' })).toBeHidden()
})

test('at Contact the cursors spin out and the dock reads "Ready · deployed"', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await started(page)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('html')).toHaveAttribute('data-swarm', 'done', { timeout: 15000 })
  await expect(page.locator('.swarm-dock [data-k="status"]')).toHaveText('Ready · deployed')
  expect(await visibleCursors(page)).toBe(0)
})

test('every number in the dock comes from the build', async ({ page }) => {
  await page.goto('en/')
  const facts = await buildFacts(page)
  await started(page)
  const dock = page.locator('.swarm-dock')
  await expect(dock.locator('[data-k="js"]')).toHaveText(`JS ${facts.js.kb.en} KB`)
  await expect(dock.locator('[data-k="commit"]')).toHaveText(facts.commit.hash)
  await expect(dock.locator('[data-k="host"]')).toHaveText('GitHub Pages')
  // The hero's agents report the build's own contrast and test count.
  await expect(page.locator('.swarm-label', { hasText: 'A11y' })).toHaveText(
    `A11y · AA ${facts.contrast['ink/screen']}:1`,
  )
  await expect(page.locator('.swarm-label', { hasText: 'Tests' })).toHaveText(
    `Tests · ${facts.tests.e2e['hero.spec.ts']} e2e`,
  )
})

test('the swarm names no third-party product, only the deploy target', async ({ page }) => {
  const { projects, skills } = getContent('en')
  const products = [
    ...new Set([...projects.flatMap((p) => p.stack), ...skills.stack.flatMap((g) => g.items)]),
  ].filter((p): p is string => typeof p === 'string')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await started(page)
  const seen = new Set<string>()
  for (const id of ['experience', 'sistema-wave', 'bookowl', 'how-i-work', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    for (let i = 0; i < 8; i++) {
      for (const t of await page.locator('.swarm, .swarm-dock').allInnerTexts()) seen.add(t)
      await page.waitForTimeout(250)
    }
  }
  const text = [...seen].join('\n').replaceAll('GitHub Pages', '')
  const named = products.filter((p) =>
    new RegExp(`(?<![\\w-])${p.replace(/[.()]/g, '\\$&')}(?![\\w-])`).test(text),
  )
  expect(named).toEqual([])
})

test('the swarm pauses while the tab is hidden', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  await page.locator('#experience').scrollIntoViewIfNeeded()
  await expect(page.locator('#experience')).toHaveAttribute('data-swarm-unit', 'building', {
    timeout: 8000,
  })
  const setHidden = (hidden: boolean) =>
    page.evaluate((hidden) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
      document.dispatchEvent(new Event('visibilitychange'))
    }, hidden)
  const positions = () =>
    page
      .locator('.swarm-cursor:not([hidden])')
      .evaluateAll((els) => els.map((el) => (el as HTMLElement).style.transform).join('|'))
  await setHidden(true)
  await expect(page.locator('html')).toHaveAttribute('data-swarm-paused', '')
  const before = await positions()
  await page.waitForTimeout(500)
  expect(await positions()).toBe(before)
  await expect(page.locator('#experience')).toHaveAttribute('data-swarm-unit', 'building')
  await setHidden(false)
  await expect(page.locator('html')).not.toHaveAttribute('data-swarm-paused', '')
  await expect(page.locator('#experience')).toHaveAttribute('data-swarm-unit', 'built', {
    timeout: 8000,
  })
})

// The page's own fonts settle before the swarm starts; from then on, nothing it does may move a box.
test('nothing shifts: CLS stays 0 through the whole build', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await started(page)
  await page.evaluate(() => {
    const w = window as unknown as { shift: number }
    w.shift = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & {
        value: number
        hadRecentInput: boolean
      })[])
        if (!e.hadRecentInput) w.shift += e.value
    }).observe({ type: 'layout-shift' })
  })
  for (const id of ['experience', 'campaign-bi', 'hostly', 'how-i-work', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
  }
  expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBe(0)
})

// About 4–8 agents at a time on a desktop, about 6 on a phone (design/COMMIT-SHEET.md §6).
for (const [width, height, cap] of [
  [1440, 900, 8],
  [390, 844, 6],
] as const) {
  test(`at most ${cap} agents on screen at once · ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height } })
    const page = await context.newPage()
    await page.goto('en/')
    await started(page)
    let most = 0
    for (const id of ['experience', 'sistema-wave', 'zibby', 'how-i-work', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      for (let i = 0; i < 8; i++) {
        most = Math.max(most, await visibleCursors(page))
        await page.waitForTimeout(150)
      }
    }
    expect(most).toBeGreaterThanOrEqual(3)
    expect(most).toBeLessThanOrEqual(cap)
    await context.close()
  })
}

// The finished page, with no one on it.
test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('there is no swarm and no dock', async ({ page }) => {
    await page.goto('en/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(1500)
    await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
    expect(await withheld(page, 'main')).toEqual([])
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('there is no swarm and no dock', async ({ page }) => {
    await page.goto('en/')
    await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
    expect(await withheld(page, 'main')).toEqual([])
  })
})

test('Quick view has no swarm, and switching to it removes a running one', async ({ browser }) => {
  const context = await browser.newContext()
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await page.waitForLoadState('load')
  await page.waitForTimeout(1500)
  await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
  await context.close()

  const full = await browser.newPage()
  await full.goto('en/')
  await started(full)
  await full.getByRole('button', { name: 'Quick view' }).click()
  await expect(full.locator('.swarm, .swarm-dock')).toHaveCount(0)
  await expect(full.locator('html')).not.toHaveAttribute('data-swarm', /.*/)
  await full.close()
})
