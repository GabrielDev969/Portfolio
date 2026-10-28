/**
 * pnpm og — the share image for each locale, 1200 × 630: the hero facts (name, role, stack,
 * place) on the page's ground, with the photo in a tone-step frame. It is drawn inside the built page, so
 * it uses the site's own fonts and colours, and saved to public/og/<locale>.png (committed).
 * Needs `pnpm build && pnpm preview`; rerun when the hero facts change.
 */
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { getContent } from '../src/content'
import { languageTags, locales } from '../src/lib/i18n'
import { asset } from '../src/lib/site'
import { stillPath } from '../src/lib/stills'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const out = join(import.meta.dirname, '..', 'public', 'og')

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

for (const locale of locales) {
  const { person } = getContent(locale)
  const stack = new Intl.ListFormat(languageTags[locale], { type: 'conjunction' }).format(
    person.coreStack,
  )
  const place = `${person.location}. ${person.workMode}.`
  const relocation = person.relocation
    ? `<p style="margin:4px 0 0;font-size:22px">${escape(person.relocation)}.</p>`
    : ''

  await page.goto(`${base}${asset(`${locale}/`)}`, { waitUntil: 'networkidle' })
  await page.evaluate(
    (html) => {
      document.body.className = ''
      document.body.innerHTML = html
    },
    `<div style="position:fixed;inset:0;display:grid;grid-template-rows:1fr 72px;background:var(--color-screen);color:var(--color-ink);font-family:var(--font-newsreader)">
      <div style="display:grid;grid-template-columns:1fr 316px;gap:56px;align-items:center;padding:0 64px">
        <div>
          <p style="margin:0 0 14px;font-size:27px;font-style:italic">${escape(person.heroLine)}</p>
          <h1 style="margin:0;font-family:var(--font-big-shoulders);font-weight:800;font-size:136px;line-height:0.86;text-transform:uppercase;letter-spacing:0.005em">${escape(person.name).replace(' ', '<br>')}</h1>
          <p style="margin:22px 0 0;font-size:30px;font-weight:600">${escape(person.role)}</p>
          <p style="margin:4px 0 0;font-size:22px">${escape(stack)}.</p>
          <p style="margin:4px 0 0;font-size:22px;font-weight:600">${escape(place)}</p>${relocation}
        </div>
        <div style="background:var(--color-screen-2);border:1px solid color-mix(in oklch, var(--color-ink) 15%, transparent);padding:18px">
          <img src="${asset(stillPath(person.photo.still, 460, 'webp'))}" alt="" style="display:block;width:280px;height:340px;object-fit:cover">
        </div>
      </div>
      <div style="border-top:1px solid color-mix(in oklch, var(--color-ink) 15%, transparent);display:flex;align-items:center;justify-content:space-between;padding:0 64px;font-size:18px">
        <span>gabrieldev969.github.io/Portfolio</span>
        <span style="font-style:italic">${escape(person.availability)}</span>
      </div>
    </div>`,
  )
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode()))
  })
  const file = join(out, `${locale}.png`)
  await sharp(await page.screenshot())
    .png({ palette: true, quality: 90 })
    .toFile(file)
  console.log(file)
}

await browser.close()
