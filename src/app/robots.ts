import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// GitHub Pages serves this at /Portfolio/robots.txt, which crawlers never request: it only
// counts once the site has its own domain. Until then the sitemap goes to Search Console by hand.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` }
}
