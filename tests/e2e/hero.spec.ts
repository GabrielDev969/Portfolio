import { expect, skipColdOpen, test } from './fixtures'
import { factVisibility, ready, startInViewMode, viewports } from './helpers'

const facts = ['name', 'role', 'stack', 'remote', 'contact', 'cv']

// The 5-second test (design/COMMIT-SHEET.md, Brief): the first screen, without scrolling,
// shows name, role, core stack, "Remote", Contact and Download CV, inside the viewport and uncovered.
for (const mode of ['film', 'quick'] as const) {
  for (const viewport of viewports) {
    test(`5-second test · ${mode} · ${viewport.width}×${viewport.height}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport })
      await skipColdOpen(context)
      await startInViewMode(context, mode)
      const page = await context.newPage()
      await page.goto('en/')
      await ready(page)

      const before = await factVisibility(page)
      expect(before.map((f) => f.fact).sort()).toEqual([...facts].sort())
      for (const f of before)
        expect(f, `${f.fact} before scrolling`).toMatchObject({ inViewport: true, uncovered: true })

      if (mode === 'film') {
        // The peak must never hide a fact: check while the bars and the name are still moving,
        // and again once they have settled.
        await page.evaluate(() => window.scrollTo(0, 2))
        await expect(page.locator('html')).toHaveAttribute('data-bars', 'open')
        for (const [moment, wait] of [
          ['mid-peak', 400],
          ['after the peak', 1000],
        ] as const) {
          await page.waitForTimeout(wait)
          for (const f of await factVisibility(page)) {
            expect(f, `${f.fact} ${moment}`).toMatchObject({ inViewport: true, uncovered: true })
          }
        }
      }
      await context.close()
    })
  }
}

test('the bars close at the top and open on the first scroll', async ({ page }) => {
  await page.goto('en/')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-bars', 'closed')
  await page.evaluate(() => window.scrollTo(0, 200))
  await expect(html).toHaveAttribute('data-bars', 'open')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(html).toHaveAttribute('data-bars', 'closed')
})

test('a deep link opens with the bars already open', async ({ page }) => {
  await page.goto('en/#projects')
  await expect(page.locator('html')).toHaveAttribute('data-bars', 'open')
})

// Spanish carries one more hero line (relocation), so check it at the tightest viewports.
for (const viewport of [viewports[0]!, viewports[2]!]) {
  test(`5-second test · es · ${viewport.width}×${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport })
    await skipColdOpen(context)
    const page = await context.newPage()
    await page.goto('es/')
    await ready(page)
    for (const f of await factVisibility(page)) {
      expect(f, f.fact).toMatchObject({ inViewport: true, uncovered: true })
    }
    await context.close()
  })
}

test('the peak never makes the page scroll sideways', async ({ browser }) => {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    await skipColdOpen(context)
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
