import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { startInViewMode, viewports } from './helpers'

const projects = ['Sistema Wave', 'Campaign BI', 'Zibby', 'Hostly', 'BookOwl']
const partOrder = [
  'The problem',
  'My role',
  'Architecture',
  'Key decisions',
  'Testing and deploy',
  'Outcome',
]

const btsButton = (page: Page, id: string) =>
  page.locator(`#${id}`).getByRole('button', { name: 'Technical details' })

/** The part headings of one project's technical details, as a reader sees them. */
const partHeadings = (page: Page, id: string) =>
  page.locator(`#${id} .details-parts h4`).filter({ visible: true }).allInnerTexts()

test('all five projects are there, in order', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#projects article h3')).toHaveText(projects)
})

test('the production build shows no TODO placeholder anywhere', async ({ page }) => {
  for (const locale of ['pt', 'en', 'es']) {
    await page.goto(`${locale}/`)
    expect(await page.content(), locale).not.toContain('TODO(gabriel)')
  }
})

// A fact still missing is left out with its label: no "The problem" over nothing, no empty
// decision, in the drawer or inline in Quick view, in any language.
for (const mode of ['full', 'quick'] as const) {
  test(`no behind-the-scenes label is left without its content · ${mode}`, async ({
    context,
    page,
  }) => {
    await startInViewMode(context, mode)
    for (const locale of ['pt', 'en', 'es']) {
      await page.goto(`${locale}/`)
      const empty = await page.locator('.details-parts').evaluateAll((all) =>
        all.flatMap((parts) => {
          const project = parts.closest('article')?.id
          const sections = [...parts.querySelectorAll(':scope > section')]
          const bare = sections
            .filter((s) => {
              const heading = s.querySelector('h4')?.textContent ?? ''
              return (s.textContent ?? '').replace(heading, '').trim() === ''
            })
            .map((s) => `${project}: "${s.querySelector('h4')?.textContent}" has no content`)
          const items = [...parts.querySelectorAll('li, p')]
            .filter((el) => (el.textContent ?? '').trim() === '')
            .map((el) => `${project}: an empty <${el.tagName.toLowerCase()}>`)
          return [...bare, ...items]
        }),
      )
      expect(empty, locale).toEqual([])
    }
  })
}

test.describe('the behind-the-scenes drawer', () => {
  test('opens from the keyboard, keeps focus inside, and Esc returns focus', async ({ page }) => {
    await page.goto('en/')
    const button = btsButton(page, 'zibby')
    await button.focus()
    await page.keyboard.press('Enter')

    const drawer = page.getByRole('dialog', { name: /Technical details\s+Zibby/ })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('button', { name: 'Close' })).toBeFocused()
    // The page behind a modal is inert: Tab moves through the drawer and, past its end, out to
    // the browser's own controls (the body here), never to the page.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const inside = await drawer.evaluate(
        (d) => d.contains(document.activeElement) || document.activeElement === document.body,
      )
      expect(inside).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(button).toBeFocused()
  })

  test('closes from the Close button and from the backdrop', async ({ page }) => {
    await page.goto('en/')
    const drawer = page.getByRole('dialog', { name: /Hostly/ })

    await btsButton(page, 'hostly').click()
    await drawer.getByRole('button', { name: 'Close' }).click()
    await expect(drawer).toBeHidden()

    await btsButton(page, 'hostly').click()
    await expect(drawer).toBeVisible()
    await page.mouse.click(20, 400)
    await expect(drawer).toBeHidden()
  })

  test('holds the parts in the fixed order, with the diagram and its text', async ({ page }) => {
    await page.goto('en/')
    for (const id of ['sistema-wave', 'campaign-bi', 'zibby', 'hostly', 'bookowl']) {
      await btsButton(page, id).click()
      const headings = await partHeadings(page, id)
      // Parts with no facts yet are left out in production; the rest keep their order.
      expect(headings).toEqual(partOrder.filter((part) => headings.includes(part)))
      expect(headings, id).toContain('Architecture')
      await expect(page.locator(`#${id} .diagram svg`)).toBeVisible()
      await expect(page.locator(`#${id} .diagram figcaption li`).first()).toBeAttached()
      await page.keyboard.press('Escape')
    }
  })

  test('the page behind it does not scroll', async ({ page }) => {
    await page.goto('en/')
    await page.locator('#zibby').scrollIntoViewIfNeeded()
    await btsButton(page, 'zibby').click()
    const before = await page.evaluate(() => scrollY)
    await page.mouse.move(20, 400)
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(400)
    expect(await page.evaluate(() => scrollY)).toBe(before)
  })
})

test('Quick view shows every project’s technical details inline, with no images', async ({
  browser,
}) => {
  const context = await browser.newContext()
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('#projects .details-parts')).toHaveCount(5)
  for (const parts of await page.locator('#projects .details-parts').all()) {
    await expect(parts.getByRole('heading', { name: 'Architecture' })).toBeVisible()
  }
  await expect(page.locator('#projects .project-image').filter({ visible: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Technical details' })).toHaveCount(0)
  await context.close()
})

test('the drawer and Quick view hold the same parts', async ({ browser }) => {
  const read = async (mode: 'full' | 'quick') => {
    const context = await browser.newContext()
    await startInViewMode(context, mode)
    const page = await context.newPage()
    await page.goto('en/')
    if (mode === 'full') await btsButton(page, 'campaign-bi').click()
    // The parts only: Quick view leaves out the drawer's copy of the links, already on the project.
    const sections = page.locator('#campaign-bi .details-parts > section')
    // Read them once they are on screen: CI once read them mid-hydration and got empty text.
    await expect(sections.first()).toBeVisible()
    const parts = await sections.allInnerTexts()
    await context.close()
    return parts.map((text) => text.replace(/\s+/g, ' ').trim())
  }
  expect(await read('quick')).toEqual(await read('full'))
})

test('before hydration, Quick view already looks as it will: parts open, nothing moves', async ({
  browser,
}) => {
  const layout = async (hydrate: boolean) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    await startInViewMode(context, 'quick')
    // Without the app's scripts (its CSS still loads) the inline head script runs, but React
    // never hydrates.
    if (!hydrate) await context.route('**/_next/static/chunks/*.js', (route) => route.abort())
    const page = await context.newPage()
    await page.goto('en/')
    await page.evaluate(() => document.fonts.ready)
    const sections = page.locator('#campaign-bi .details-parts > section')
    await expect(sections.first()).toBeVisible()
    if (hydrate) await expect(page.locator('#campaign-bi details')).toHaveCount(0)
    else await expect(page.locator('#campaign-bi details')).toHaveCount(1)
    await expect(page.locator('header.top-bar button[aria-pressed]')).toHaveAccessibleName(
      'Full view',
    )
    const result = {
      parts: (await sections.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()),
      bookowl: await page
        .locator('#bookowl')
        .evaluate((el) => el.getBoundingClientRect().top + scrollY),
    }
    await context.close()
    return result
  }
  const before = await layout(false)
  const after = await layout(true)
  expect(before.parts).toEqual(after.parts)
  expect(before.parts.every((t) => t.length > 0)).toBe(true)
  // The last project sits where it will be once React has taken over.
  expect(Math.abs(before.bookowl - after.bookowl)).toBeLessThanOrEqual(4)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('technical details open in place as a disclosure', async ({ page }) => {
    await page.goto('en/')
    const details = page.locator('#zibby details')
    await expect(details.locator('h4', { hasText: 'Architecture' })).toBeHidden()
    await details.locator('summary').click()
    await expect(details.locator('h4', { hasText: 'Architecture' })).toBeVisible()
    await expect(
      page.locator('#bookowl').getByRole('link', { name: 'Source on GitHub' }),
    ).toBeVisible()
  })
})

test('the projects never widen the page', async ({ browser }) => {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto('en/#projects')
    for (const id of ['sistema-wave', 'zibby', 'bookowl']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${viewport.width}px at ${id}`).toBe(0)
    }
    await context.close()
  }
})

// An arrow runs from the bottom of one box to the top of another, and never across a third.
test('no architecture arrow crosses a box', async ({ browser }) => {
  // Quick view lays every diagram out inline; in the full view they wait in closed drawers.
  const context = await browser.newContext()
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  const crossings = await page.evaluate(() => {
    const out: string[] = []
    for (const svg of document.querySelectorAll<SVGSVGElement>('.diagram svg')) {
      const boxes = [...svg.querySelectorAll<SVGRectElement>('g > rect:not(.fill-screen-2)')].map(
        (r) => r.getBBox(),
      )
      for (const line of svg.querySelectorAll<SVGLineElement>('g > line.stroke-ink[marker-end]')) {
        const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((a) => +line.getAttribute(a)!)
        // Sample the inner part of the arrow; its ends touch their own boxes.
        for (let t = 0.1; t <= 0.9; t += 0.05) {
          const x = x1! + (x2! - x1!) * t
          const y = y1! + (y2! - y1!) * t
          const hit = boxes.some(
            (b) => x > b.x && x < b.x + b.width && y > b.y && y < b.y + b.height,
          )
          if (hit) {
            out.push(`${svg.closest('article')?.id}: ${x1},${y1} → ${x2},${y2}`)
            break
          }
        }
      }
    }
    return out
  })
  expect(crossings).toEqual([])
  await context.close()
})
