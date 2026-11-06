import type { Browser, Page } from '@playwright/test'
// Not ./fixtures: these tests watch the build a first visit gets.
import { expect, test } from '@playwright/test'
import { getContent } from '../../src/content'
import type { BuildFacts } from '../../src/swarm/facts'
import { startInViewMode } from './helpers'

// design/COMMIT-SHEET.md §6 (Gabriel, 2026-11-06): the page opens empty and a swarm of agents
// builds it, scrolling down by itself; every word is in the HTML from the first byte.

/** The facts the build wrote, as the page fetches them (read in each test: the build lists
 *  these tests before it writes the file). */
const buildFacts = async (page: Page) =>
  (await (await page.request.get('build-facts.json')).json()) as BuildFacts

const started = (page: Page) => page.locator('.swarm-dock').waitFor({ state: 'attached' })
/** Agents at work: on screen and not on their way out. */
const atWork = (page: Page) =>
  page.locator('.swarm-cursor:not([hidden]):not(.swarm-leaving)').count()

/** The words of main, normalized, as innerText gets them (opacity does not hide words). */
const mainText = (page: Page) =>
  page.locator('main').evaluate((m) => {
    // The controls that exist only with JavaScript (Copy, Build it again) are left out.
    let text = (m as HTMLElement).innerText
    for (const c of m.querySelectorAll<HTMLElement>('.email-copy, .replay'))
      // Only when shown: a hidden one's innerText is its raw text, which a mockup may share.
      if (c.checkVisibility()) text = text.replace(c.innerText, '')
    return text.replace(/\s+/g, ' ').trim()
  })

/** The page as it is without JavaScript: the content every visitor gets. */
async function noJsText(browser: Browser) {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('en/')
  const text = await mainText(page)
  await context.close()
  return text
}

/** Text that is not on screen for the eye: faded or hidden, by itself or an ancestor. */
const unseen = (page: Page) =>
  page.locator('main').evaluate((root) =>
    [...root.querySelectorAll('h1, h2, h3, p, dt, dd, li, a')]
      .filter((el) => (el.textContent ?? '').trim() !== '')
      .filter((el) => el.checkVisibility())
      .filter(
        (el) =>
          !el.checkVisibility({ opacityProperty: true }) ||
          Number(getComputedStyle(el).opacity) < 1,
      )
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}"`),
  )

test('it opens empty, with every word already in the page', async ({ browser, page }) => {
  const reference = await noJsText(browser)
  await page.goto('en/')
  await expect(page.locator('html')).toHaveAttribute('data-build', '')
  expect(await page.locator('#hero-name').evaluate((el) => getComputedStyle(el).opacity)).toBe('0')
  // Hidden from the eye only: the words are in the HTML and the accessibility tree.
  expect(await mainText(page)).toBe(reference)
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Gabriel\s*Santos/i)
})

// Gabriel, 2026-11-06: on a first visit the full hero (name, role, stack, Remote and both
// buttons) is on screen within 1.5 s of opening the page, and Skip is visible all along.
for (const [width, height] of [
  [1440, 900],
  [1280, 720],
  [390, 844],
] as const) {
  test(`the 5-second facts are all on screen within 1.5 s · ${width}×${height}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width, height } })
    const page = await context.newPage()
    await page.goto('en/')
    await expect(page.locator('html')).toHaveAttribute('data-build', '')
    // Milliseconds since navigation started, when every fact is shown, in view and unveiled.
    const ready = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const check = () => {
            const veils = [...document.querySelectorAll('.swarm-veil')].map((v) =>
              v.getBoundingClientRect(),
            )
            const facts = [...document.querySelectorAll('[data-fact]')]
            const ok =
              facts.length === 6 &&
              facts.every((el) => {
                const r = el.getBoundingClientRect()
                const covered = veils.some(
                  (v) =>
                    v.width > 1 &&
                    v.left < r.right &&
                    v.right > r.left &&
                    v.top < r.bottom &&
                    v.bottom > r.top,
                )
                return (
                  el.checkVisibility({ opacityProperty: true }) &&
                  r.bottom <= innerHeight &&
                  r.top >= 0 &&
                  !covered
                )
              })
            if (ok) resolve(performance.now())
            else requestAnimationFrame(check)
          }
          check()
        }),
    )
    expect(ready).toBeLessThanOrEqual(1500)
    await expect(page.getByRole('button', { name: 'Skip build' })).toBeInViewport()
    await page.waitForTimeout(3000)
    await expect(page.getByRole('button', { name: 'Skip build' })).toBeInViewport()
    await context.close()
  })
}

// The whole show, watched without touching anything.
for (const [width, height, cap] of [
  [1440, 900, 8],
  [390, 844, 6],
] as const) {
  test(`it builds the whole page and scrolls down by itself · ${width}px`, async ({ browser }) => {
    test.setTimeout(120_000)
    const reference = await noJsText(browser)
    const context = await browser.newContext({ viewport: { width, height } })
    const page = await context.newPage()
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
    let deepest = 0
    let most = 0
    let typed = false
    let dragged = false
    const seen = new Set<string>()
    while ((await page.locator('html').getAttribute('data-swarm')) !== 'done') {
      deepest = Math.max(deepest, await page.evaluate(() => scrollY))
      most = Math.max(most, await atWork(page))
      typed ||= (await page.locator('.swarm-veil').count()) > 0
      dragged ||= (await page.locator('.swarm-ghost').count()) > 0
      for (const t of await page.locator('.swarm, .swarm-dock').allInnerTexts()) seen.add(t)
      await page.waitForTimeout(400)
    }
    // It went all the way down on its own, typing and dragging on the way.
    expect(deepest).toBeGreaterThan(3000)
    expect(typed && dragged).toBe(true)
    expect(most).toBeGreaterThanOrEqual(3)
    expect(most).toBeLessThanOrEqual(cap)
    // Then the page is the reader's: all of it there, nothing moved, the same words.
    await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/)
    await expect(page.locator('.swarm-dock [data-k="status"]')).toHaveText('Ready · deployed')
    // Buttons finish their own 220 ms fade once they are shown.
    await expect.poll(() => unseen(page)).toEqual([])
    expect(await mainText(page)).toBe(reference)
    expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBe(0)
    expect(await page.evaluate(() => sessionStorage.getItem('swarm:built'))).toBe('1')
    // No third-party product is named, only the deploy target.
    const { projects, skills } = getContent('en')
    const products = [
      ...new Set([...projects.flatMap((p) => p.stack), ...skills.stack.flatMap((g) => g.items)]),
    ].filter((p): p is string => typeof p === 'string')
    const text = [...seen].join('\n').replaceAll('GitHub Pages', '')
    const named = products.filter((p) =>
      new RegExp(`(?<![\\w-])${p.replace(/[.()]/g, '\\$&')}(?![\\w-])`).test(text),
    )
    expect(named).toEqual([])
    await context.close()
  })
}

test('the reader scrolls: the build hands over, everything at once', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  await page.waitForTimeout(1500)
  await page.mouse.wheel(0, 400)
  await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/, { timeout: 500 })
  await expect(page.locator('html')).toHaveAttribute('data-swarm', 'done')
  expect(await atWork(page)).toBe(0)
  // Buttons finish their own 220 ms fade once they are shown.
  await expect.poll(() => unseen(page)).toEqual([])
})

test('Skip build finishes everything at once', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  await page.getByRole('button', { name: 'Skip build' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-swarm', 'done')
  await expect(page.locator('.swarm-dock [data-k="status"]')).toHaveText('Ready · deployed')
  await expect(page.locator('.swarm-dock [data-k="progress"]')).toHaveText('100%')
  await expect(page.locator('.swarm > :not(.swarm-cursor)')).toHaveCount(0)
  // Buttons finish their own 220 ms fade once they are shown.
  await expect.poll(() => unseen(page)).toEqual([])
  await expect(page.getByRole('button', { name: 'Skip build' })).toBeHidden()
})

test('every number in the dock comes from the build', async ({ page }) => {
  await page.goto('en/')
  const facts = await buildFacts(page)
  await started(page)
  const dock = page.locator('.swarm-dock')
  await expect(dock.locator('[data-k="js"]')).toHaveText(`JS ${facts.js.kb.en} KB`)
  await expect(dock.locator('[data-k="commit"]')).toHaveText(facts.commit.hash)
  await expect(dock.locator('[data-k="host"]')).toHaveText('GitHub Pages')
  await expect(page.locator('.swarm-label', { hasText: 'Perf' })).toHaveText(
    `Perf · JS ${facts.js.kb.en} KB`,
  )
})

test('it pauses while the tab is hidden', async ({ page }) => {
  await page.goto('en/')
  await started(page)
  await page.waitForTimeout(1200)
  const setHidden = (hidden: boolean) =>
    page.evaluate((hidden) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
      document.dispatchEvent(new Event('visibilitychange'))
    }, hidden)
  const progress = () => page.locator('.swarm-dock [data-k="progress"]').textContent()
  await setHidden(true)
  await expect(page.locator('html')).toHaveAttribute('data-swarm-paused', '')
  const before = await progress()
  await page.waitForTimeout(800)
  expect(await progress()).toBe(before)
  await setHidden(false)
  await expect(page.locator('html')).not.toHaveAttribute('data-swarm-paused', '')
  await expect.poll(progress, { timeout: 4000 }).not.toBe(before)
})

// The finished page, with no one on it.
test.describe('the finished page from the first paint', () => {
  // Already built (a reload this session, a deep link): the page is all there at once, and
  // the dock is back as it was at the end, ready to build it again.
  const finishedDock = async (page: Page) => {
    await expect(page.locator('.swarm-dock [data-k="status"]')).toHaveText('Ready · deployed')
    await expect(page.locator('.swarm-dock [data-k="progress"]')).toHaveText('100%')
    await expect(
      page.locator('.swarm-dock').getByRole('button', { name: 'Build it again' }),
    ).toBeVisible()
    expect(await atWork(page)).toBe(0)
  }

  test('on a second visit this session, with the finished dock', async ({ page }) => {
    await page.goto('en/')
    await page.evaluate(() => sessionStorage.setItem('swarm:built', '1'))
    await page.reload()
    await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/)
    await finishedDock(page)
    await expect.poll(() => unseen(page)).toEqual([])
    // And it builds again from there.
    await page.locator('.swarm-dock').getByRole('button', { name: 'Build it again' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-build', '')
    await expect(page.locator('html')).toHaveAttribute('data-swarm', /booting|building/)
  })

  test('on a deep link, with the finished dock', async ({ page }) => {
    await page.goto('en/#contact')
    await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/)
    await expect(page.locator('#contact h2')).toBeInViewport()
    await finishedDock(page)
    await expect.poll(() => unseen(page)).toEqual([])
  })

  test('if the swarm cannot load, within 5 s', async ({ browser }) => {
    const context = await browser.newContext()
    await context.route('**/_next/static/chunks/*.js', (route) => route.abort())
    const page = await context.newPage()
    await page.goto('en/')
    await expect(page.locator('html')).toHaveAttribute('data-build', '')
    await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/, { timeout: 6000 })
    // Buttons finish their own 220 ms fade once they are shown.
    await expect.poll(() => unseen(page)).toEqual([])
    await context.close()
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })
    test('no build, no swarm', async ({ page }) => {
      await page.goto('en/')
      await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/)
      await page.waitForTimeout(1000)
      await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
      // Buttons finish their own 220 ms fade once they are shown.
      await expect.poll(() => unseen(page)).toEqual([])
    })
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })
    test('no build, no swarm', async ({ page }) => {
      await page.goto('en/')
      await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
      // Buttons finish their own 220 ms fade once they are shown.
      await expect.poll(() => unseen(page)).toEqual([])
    })
  })

  test('in Quick view, and switching to it mid-build shows everything', async ({ browser }) => {
    const context = await browser.newContext()
    await startInViewMode(context, 'quick')
    const page = await context.newPage()
    await page.goto('en/')
    await expect(page.locator('html')).not.toHaveAttribute('data-build', /.*/)
    await expect(page.locator('.swarm, .swarm-dock')).toHaveCount(0)
    await context.close()

    const full = await browser.newPage()
    await full.goto('en/')
    await started(full)
    await full.getByRole('button', { name: 'Quick view' }).click({ force: true })
    await expect(full.locator('.swarm, .swarm-dock')).toHaveCount(0)
    await expect(full.locator('html')).not.toHaveAttribute('data-build', /.*/)
    await full.close()
  })
})
