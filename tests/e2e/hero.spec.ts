import { expect, test } from './fixtures'
import { factVisibility, ready, startInViewMode, viewports } from './helpers'

const facts = ['name', 'role', 'stack', 'remote', 'contact', 'cv']

// The 5-second test (design/COMMIT-SHEET.md, Brief): the first screen, without scrolling,
// shows name, role, core stack, "Remote", Contact and Download CV, inside the viewport and uncovered.
for (const mode of ['full', 'quick'] as const) {
  for (const viewport of viewports) {
    test(`5-second test · ${mode} · ${viewport.width}×${viewport.height}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport })
      await startInViewMode(context, mode)
      const page = await context.newPage()
      await page.goto('en/')
      await ready(page)

      const before = await factVisibility(page)
      expect(before.map((f) => f.fact).sort()).toEqual([...facts].sort())
      for (const f of before)
        expect(f, `${f.fact} before scrolling`).toMatchObject({ inViewport: true, uncovered: true })

      if (mode === 'full') {
        // The name's entrance never hides a fact: check again once it has settled.
        await page.waitForTimeout(1300)
        for (const f of await factVisibility(page)) {
          expect(f, `${f.fact} after the entrance`).toMatchObject({
            inViewport: true,
            uncovered: true,
          })
        }
      }
      await context.close()
    })
  }
}

test('the page opens on the hero, with nothing over it', async ({ page }) => {
  await page.goto('en/')
  // No intro screen, no overlay: the name is the first thing hit at the centre of the screen.
  const hit = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    return el?.closest('#top') !== null
  })
  expect(hit).toBe(true)
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/)
})

test('the top bar stays in place and above the content while scrolling', async ({ page }) => {
  await page.goto('en/#projects')
  const bar = page.locator('header.top-bar')
  await expect(bar).toBeInViewport()
  expect(await bar.evaluate((el) => el.getBoundingClientRect().top)).toBe(0)
  const onTop = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, 8)
    return el?.closest('header.top-bar') !== null
  })
  expect(onTop).toBe(true)
})

// The translated buttons are longer, and Spanish carries one more hero line (relocation), so
// check both at the tightest viewports.
for (const locale of ['pt', 'es']) {
  for (const viewport of [viewports[0]!, viewports[2]!]) {
    test(`5-second test · ${locale} · ${viewport.width}×${viewport.height}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport })
      const page = await context.newPage()
      await page.goto(`${locale}/`)
      await ready(page)
      const before = await factVisibility(page)
      expect(before.map((f) => f.fact).sort()).toEqual([...facts].sort())
      for (const f of before) {
        expect(f, f.fact).toMatchObject({ inViewport: true, uncovered: true })
      }
      await context.close()
    })
  }
}

test('the peak never makes the page scroll sideways', async ({ browser }) => {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto('en/')
    await page.evaluate(() => window.scrollTo(0, 2))
    await page.waitForTimeout(1300)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `${viewport.width}px`).toBe(0)
    await context.close()
  }
})
