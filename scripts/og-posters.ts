/**
 * pnpm og — the share image for each locale, 1200 × 630, in the console look of the hero: the
 * dotted ground, the greeting, the name with its accent full stop, the role pill, the core stack
 * as chips and the duotone photo in its bracketed card, over a mono footer with the address and
 * availability. It is drawn inside the built page, so it uses the site's own fonts, colours and
 * classes, and saved to public/og/<locale>.png (committed). The Apple touch icon is rendered from
 * src/app/icon.svg in the same run.
 * Needs `pnpm build && pnpm preview`; rerun when the hero facts or the monogram change.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { getContent } from '../src/content'
import { locales } from '../src/lib/i18n'
import { asset, siteUrl } from '../src/lib/site'
import { imagePath } from '../src/lib/images'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const root = join(import.meta.dirname, '..')
const out = join(root, 'public', 'og')

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

const mono = 'font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.06em'
const line = 'var(--color-line)'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

for (const locale of locales) {
  const { person, ui } = getContent(locale)
  const chips = person.coreStack
    .map(
      (name) =>
        `<li style="padding:6px 12px;border:1px solid ${line};border-radius:4px;font-family:var(--font-mono);font-size:19px">${escape(name)}</li>`,
    )
    .join('')
  const words = person.name.split(' ').map(escape)
  const name = words
    .map((w, i) =>
      i === words.length - 1 ? `${w}<span style="color:var(--color-accent)">.</span>` : w,
    )
    .join('<br>')
  // Spanish only.
  const relocation = person.relocation
    ? `<p style="margin:16px 0 0;font-size:24px;font-style:italic;color:var(--color-ink-2)">${escape(person.relocation)}.</p>`
    : ''

  await page.goto(`${base}${asset(`${locale}/`)}`, { waitUntil: 'networkidle' })
  await page.evaluate(
    (html) => {
      delete document.documentElement.dataset.build
      document.body.className = ''
      document.body.innerHTML = html
    },
    `<div style="position:fixed;inset:0;display:grid;grid-template-rows:1fr 76px;overflow:hidden">
      <p aria-hidden="true" style="position:absolute;left:-12px;bottom:40px;margin:0;font-family:var(--font-display);font-weight:900;font-stretch:125%;font-size:230px;line-height:0.8;color:transparent;-webkit-text-stroke:1.5px oklch(1 0 0 / 0.07);white-space:nowrap">${escape(ui.backdrop)}</p>
      <div style="position:relative;display:grid;grid-template-columns:1fr 330px;gap:64px;align-items:center;padding:0 72px">
        <div>
          <p style="margin:0;font-size:30px;font-style:italic;color:var(--color-ink-2)">${escape(ui.greeting)}</p>
          <h1 style="margin:6px 0 0;font-family:var(--font-display);font-weight:900;font-stretch:118%;font-size:104px;line-height:0.9;letter-spacing:-0.01em;text-transform:uppercase">${name}</h1>
          <p style="display:inline-flex;align-items:center;gap:12px;margin:28px 0 0;padding:9px 18px;border:1px solid ${line};border-radius:999px;${mono};font-size:18px">
            <span style="width:9px;height:9px;border-radius:50%;background:var(--color-cyan)"></span>
            <span>${escape(person.role)}</span><span style="color:var(--color-ink-2)">·</span><span>${escape(person.workMode)}</span>
          </p>
          <ul style="display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0;padding:0;list-style:none">${chips}</ul>${relocation}
        </div>
        <figure class="card card-brackets" style="margin:0;padding:16px">
          <img src="${asset(imagePath('portrait', 460, 'webp'))}" alt="" style="display:block;width:296px;height:296px;object-fit:cover">
          <figcaption style="margin-top:12px;${mono};font-size:15px;color:var(--color-ink-2)">${escape(`// ${person.location} · ${person.workMode}`)}</figcaption>
        </figure>
      </div>
      <div style="position:relative;border-top:1px solid ${line};display:flex;align-items:center;justify-content:space-between;padding:0 72px;${mono};font-size:17px;color:var(--color-ink-2);background:var(--color-screen)">
        <span style="white-space:nowrap"><span style="color:var(--color-accent)">//</span> ${escape(siteUrl.replace(/^https?:\/\//, ''))}</span>
        <span style="white-space:nowrap">${escape(person.availability)}</span>
      </div>
    </div>`,
  )
  await page.evaluate(async () => {
    // The mono face is font-display: optional; ask for every face so none falls back.
    const style = getComputedStyle(document.documentElement)
    await Promise.all(
      [
        ['900 1em', '--font-display'],
        ['italic 1em', '--font-text'],
        ['500 1em', '--font-mono'],
      ].map(([font, v]) => document.fonts.load(`${font} ${style.getPropertyValue(v!).trim()}`)),
    )
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

// The touch icon is masked to the system's own shape, so it goes edge to edge: the ground
// without its rounded corner or hairline, the monogram and the accent stop as in the favicon.
const icon = readFileSync(join(root, 'src', 'app', 'icon.svg'), 'utf8')
  .replace(/<rect width="32" height="32" rx="[\d.]+"/, '<rect width="32" height="32"')
  .replace(/\s*<rect x="0.75"[^>]*\/>/, '')
const apple = join(root, 'src', 'app', 'apple-icon.png')
await sharp(Buffer.from(icon), { density: (72 * 180) / 32 })
  .resize(180, 180)
  .png({ palette: true })
  .toFile(apple)
console.log(apple)
