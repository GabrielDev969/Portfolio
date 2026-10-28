import { getContent } from '../../src/content'
import { languageTags, locales } from '../../src/lib/i18n'
import { expect, test } from './fixtures'

const site = 'https://gabrieldev969.github.io/Portfolio'

for (const locale of locales) {
  test(`search and share metadata · ${locale}`, async ({ page, request }) => {
    const { meta, person } = getContent(locale)
    await page.goto(`${locale}/`)
    await expect(page).toHaveTitle(meta.title)
    const head = page.locator('head')
    await expect(head.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      meta.description,
    )
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${site}/${locale}/`,
    )
    for (const other of locales) {
      await expect(
        head.locator(`link[rel="alternate"][hreflang="${languageTags[other]}"]`),
      ).toHaveAttribute('href', `${site}/${other}/`)
    }
    await expect(head.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${site}/en/`,
    )

    const image = await head.locator('meta[property="og:image"]').getAttribute('content')
    expect(image).toBe(`${site}/og/${locale}.png`)
    const poster = await request.get(image!.replace(site, '/Portfolio'))
    expect(poster.ok()).toBe(true)
    expect(poster.headers()['content-type']).toBe('image/png')

    const jsonLd = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? '',
    )
    expect(jsonLd).toMatchObject({ '@type': 'Person', name: person.name, jobTitle: person.role })
  })
}

test('the sitemap lists every locale with its alternates', async ({ request }) => {
  const xml = await (await request.get('sitemap.xml')).text()
  for (const locale of locales) {
    expect(xml).toContain(`<loc>${site}/${locale}/</loc>`)
    expect(xml).toContain(`hreflang="${languageTags[locale]}" href="${site}/${locale}/"`)
  }
})
