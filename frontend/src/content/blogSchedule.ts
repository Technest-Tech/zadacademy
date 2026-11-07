import type { BlogPost } from './blog'
import { blogPostsFr } from './blogFr'

/**
 * French articles are scheduled: each one carries its publication date in
 * blogFr.ts and stays hidden — from the blog, the sitemap and its own URL —
 * until that date. Pages revalidate hourly, so an article appears on its own
 * within the hour, without a deploy.
 */
export function publishedPostsFr(now: Date = new Date()): BlogPost[] {
  return blogPostsFr
    .filter((p) => new Date(p.published_at) <= now)
    // Newest first, by date rather than by position in blogFr.ts, so the
    // featured article is always the latest one however the file is ordered.
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
}

/**
 * Turn links to articles that are not out yet into plain text, so an early
 * article never sends readers to a 404.
 */
export function unlinkUnpublished(html: string, now: Date = new Date()): string {
  const live = new Set(publishedPostsFr(now).map((p) => p.slug))
  return html.replace(/<a href="\/fr\/blog\/([^"]+)">(.*?)<\/a>/g, (match, slug: string, text: string) =>
    live.has(slug) ? match : text,
  )
}
