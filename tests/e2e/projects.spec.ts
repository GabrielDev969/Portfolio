import type { Page } from '@playwright/test'
import { getContent } from '../../src/content'
import { locales } from '../../src/lib/i18n'
import { expect, test } from './fixtures'
import { settled, startInViewMode, viewports } from './helpers'

const projects = ['Sistema Wave', 'Campaign BI', 'Zibby', 'Hostly', 'BookOwl']
const ids = ['sistema-wave', 'campaign-bi', 'zibby', 'hostly', 'bookowl']

/**
 * Each project's parts as a reader meets them: its labels in order, any label left without
 * text, and whether every part is on screen (not hidden or collapsed).
 */
const readParts = (page: Page) =>
  page.locator('#projects article').evaluateAll((articles) =>
    articles.map((article) => {
      const parts = [...article.querySelectorAll('.project-part')]
      return {
        id: article.id,
        labels: parts.map((p) => p.querySelector('dt')?.textContent ?? ''),
        empty: parts
          .filter((p) => {
            const dd = p.querySelector('dd')
            return !dd || ((dd.textContent ?? '').trim() === '' && !dd.querySelector('svg'))
          })
          .map((p) => p.querySelector('dt')?.textContent),
        hidden: parts
          .filter((p) => {
            const box = p.getBoundingClientRect()
            return (
              box.width === 0 || box.height === 0 || getComputedStyle(p).visibility !== 'visible'
            )
          })
          .map((p) => p.querySelector('dt')?.textContent),
      }
    }),
  )

test('all five projects are there, in order', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#projects article h3')).toHaveText(projects)
})

test('the production build shows no TODO placeholder anywhere', async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`${locale}/`)
    expect(await page.content(), locale).not.toContain('TODO(gabriel)')
  }
})

// design/COMMIT-SHEET.md §4: one page, no clicking. Every part is on the page in a fixed order,
// with its text, in every view and language.
for (const mode of ['full', 'quick'] as const) {
  test(`every project shows problem, what I built, architecture and result inline · ${mode}`, async ({
    context,
    page,
  }) => {
    await startInViewMode(context, mode)
    for (const locale of locales) {
      const { project } = getContent(locale).ui
      const order = [project.problem, project.built, project.architecture, project.result]
      await page.goto(`${locale}/`)
      const read = await readParts(page)
      expect(read.map((p) => p.id)).toEqual(ids)
      for (const p of read) {
        expect(p.labels, `${locale} ${p.id}`).toEqual(order)
        expect(p.empty, `${locale} ${p.id}`).toEqual([])
        expect(p.hidden, `${locale} ${p.id}`).toEqual([])
      }
      // The stack follows: a panel in the full view, a sentence in Quick view.
      const stack = mode === 'full' ? '.project-stack' : '.project-stack-sentence'
      await expect(page.locator(`#projects ${stack}`).filter({ visible: true })).toHaveCount(5)
    }
  })
}

test('nothing in the projects waits behind a click', async ({ context, page }) => {
  for (const mode of ['full', 'quick'] as const) {
    await startInViewMode(context, mode)
    await page.goto('en/')
    const projects = page.locator('#projects')
    await expect(projects.locator('dialog, details, button'), mode).toHaveCount(0)
  }
})

test('the architecture is laid out inline as a pipeline, with its text for screen readers', async ({
  page,
}) => {
  await page.goto('en/')
  for (const id of ids) {
    await expect(page.locator(`#${id} .project-architecture .pipeline .node`).first()).toBeVisible()
    await expect(page.locator(`#${id} .pipeline figcaption li`).first()).toBeAttached()
  }
  // Every node of the content is a chip, in the order of the data flow.
  const nodes = await page.locator('#campaign-bi .pipeline .node').allInnerTexts()
  expect(nodes[0]).toBe('RedTrack')
  expect(nodes.at(-1)).toBe('PostgreSQL')
})

test('before the app’s JS arrives, every part is already readable', async ({ browser }) => {
  const context = await browser.newContext()
  // The CSS loads; the app's scripts never do, as on a slow first paint.
  await context.route('**/_next/static/chunks/*.js', (route) => route.abort())
  const page = await context.newPage()
  await page.goto('en/')
  for (const p of await readParts(page)) {
    expect(p.empty, p.id).toEqual([])
    expect(p.hidden, p.id).toEqual([])
  }
  await expect(page.locator('#zibby .project-built dd')).toContainText('modular monolith')
  await context.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every part and link is on the page', async ({ page }) => {
    await page.goto('en/')
    for (const p of await readParts(page)) {
      expect(p.labels, p.id).toEqual(['Problem', 'What I built', 'Architecture', 'Result'])
      expect(p.empty, p.id).toEqual([])
      expect(p.hidden, p.id).toEqual([])
    }
    await expect(
      page.locator('#bookowl').getByRole('link', { name: 'Source on GitHub' }),
    ).toBeVisible()
  })
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the text of each project is simply there, finished', async ({ page }) => {
    await page.goto('en/')
    await settled(page)
    for (const id of ids) {
      const project = page.locator(`#${id}`)
      await project.scrollIntoViewIfNeeded()
      const moved = await project.locator('.project-summary').evaluate((list) =>
        [list, ...list.querySelectorAll('*')]
          .filter((el) => !el.closest('svg'))
          .filter((el) => {
            const style = getComputedStyle(el)
            return style.transform !== 'none' || Number(style.opacity) < 1
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
      )
      expect(moved, id).toEqual([])
    }
  })
})

test('Quick view shows no images and no stack panels', async ({ context, page }) => {
  await startInViewMode(context, 'quick')
  await page.goto('en/')
  await expect(page.locator('#projects .project-image').filter({ visible: true })).toHaveCount(0)
  await expect(page.locator('#projects .project-stack').filter({ visible: true })).toHaveCount(0)
  await expect(page.locator('#sistema-wave .project-stack-sentence')).toHaveText(
    'Stack: Next.js, React, NestJS, TypeScript, PostgreSQL, Meta API, Prometheus, Grafana, Jenkins.',
  )
})

test('before hydration, Quick view already looks as it will', async ({ browser }) => {
  const bookowlTop = async (hydrate: boolean) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    await startInViewMode(context, 'quick')
    // Without the app's scripts (its CSS still loads) the inline head script runs, but React
    // never hydrates.
    if (!hydrate) await context.route('**/_next/static/chunks/*.js', (route) => route.abort())
    const page = await context.newPage()
    await page.goto('en/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('header.top-bar button[aria-pressed]')).toHaveAccessibleName(
      'Full view',
    )
    const top = await page
      .locator('#bookowl')
      .evaluate((el) => el.getBoundingClientRect().top + scrollY)
    await context.close()
    return top
  }
  // The last project sits where it will be once React has taken over.
  expect(Math.abs((await bookowlTop(false)) - (await bookowlTop(true)))).toBeLessThanOrEqual(4)
})

test('the projects never widen the page', async ({ browser }) => {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto('en/#projects')
    for (const id of ['sistema-wave', 'zibby', 'hostly', 'bookowl']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${viewport.width}px at ${id}`).toBe(0)
    }
    await context.close()
  }
})

// From 1024 px the parts sit around the image: none may overlap another one's text. The text
// boxes (dd) leave out the room the text column keeps under it for the stack panel.
test('in the full view, no project part overlaps another', async ({ browser }) => {
  for (const width of [1024, 1280, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.goto('en/')
    await page.evaluate(() => document.fonts.ready)
    const overlaps = await page.locator('#projects article').evaluateAll((articles) =>
      articles.flatMap((article) => {
        const parts = [
          ...article.querySelectorAll<HTMLElement>(
            '.project-head, .project-part > dd, .project-stack, .project-links',
          ),
        ].map((el) => ({
          name: [...(el.closest('.project-part') ?? el).classList].find(
            (c) => c.startsWith('project-') && c !== 'project-part',
          )!,
          box: el.getBoundingClientRect(),
        }))
        const out: string[] = []
        for (const [i, a] of parts.entries()) {
          for (const b of parts.slice(i + 1)) {
            const x = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left)
            const y = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top)
            if (x > 1 && y > 1) out.push(`${article.id}: ${a.name} × ${b.name}`)
          }
        }
        return out
      }),
    )
    expect(overlaps, `${width}px`).toEqual([])
    await context.close()
  }
})
