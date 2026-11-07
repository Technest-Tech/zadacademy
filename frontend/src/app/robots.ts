import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

/** The one host search engines may index. Staging and local hosts stay hidden. */
const PRODUCTION_HOST = 'zadacademiq.com'

/**
 * Production is detected from the host the build serves, not from Vercel's
 * `VERCEL_ENV`: the site runs on our own VPS (PM2 + nginx), where `VERCEL_ENV`
 * is never set — which used to publish `Disallow: /` and hide the whole site
 * from Google.
 */
function isProductionSite(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production'
  const host = process.env.NEXT_PUBLIC_SITE_HOST ?? new URL(siteConfig.url).host
  return host.replace(/^www\./, '') === PRODUCTION_HOST
}

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
