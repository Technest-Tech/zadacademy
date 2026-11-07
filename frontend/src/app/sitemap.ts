import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { blogPosts } from '@/content/blog'
import { publishedPostsFr } from '@/content/blogSchedule'

/** Rebuilt hourly so scheduled articles join the sitemap on their publication day. */
export const revalidate = 3600
import { courseSlugs } from '@/config/nav'

const base = siteConfig.url
const now = new Date()

type Entry = {
  path: string
  lastModified: Date
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

const entries: Entry[] = [
  { path: '', lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
  { path: '/courses', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/pricing', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', lastModified: now, changeFrequency: 'daily', priority: 0.6 },
  ...['/legal-notice', '/privacy', '/terms'].map((path) => ({
    path,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.2,
  })),
  ...courseSlugs.map((slug) => ({
    path: `/courses/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  })),
]

/**
 * Every route is published twice — English at `/path` and French at `/fr/path` —
 * each carrying hreflang alternates pointing at the other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = entries.flatMap(({ path, lastModified, changeFrequency, priority }) => {
    const en = `${base}${path}`
    const fr = `${base}/fr${path}`
    const languages = { en, fr }
    return [
      { url: en, lastModified, changeFrequency, priority, alternates: { languages } },
      { url: fr, lastModified, changeFrequency, priority, alternates: { languages } },
    ]
  })
  return pages.concat(
    // Articles exist in one language each.
    blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    publishedPostsFr().map((post) => ({
      url: `${base}/fr/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  )
}
