import { describe, it, expect } from 'vitest'
import { blogPostsFr } from '@/content/blogFr'
import { publishedPostsFr, unlinkUnpublished } from '@/content/blogSchedule'

describe('publishedPostsFr', () => {
  it('lists every French article once its date has passed', () => {
    expect(publishedPostsFr(new Date('2026-11-08T00:00:00Z'))).toHaveLength(blogPostsFr.length)
  })

  it('leads with the article the schedule put first, newest first after it', () => {
    const posts = publishedPostsFr(new Date('2026-11-08T00:00:00Z'))
    expect(posts[0].slug).toBe('cours-de-coran-en-ligne-comment-choisir')
    const times = posts.map((p) => Date.parse(p.published_at))
    expect(times).toEqual([...times].sort((a, b) => b - a))
  })

  it('still hides an article dated in the future', () => {
    expect(publishedPostsFr(new Date('2026-11-07T00:00:00Z'))).toHaveLength(0)
  })

  it('keeps links between published articles, and unlinks them before', () => {
    const html = '<a href="/fr/blog/aider-son-enfant-a-memoriser-le-coran">lien</a>'
    expect(unlinkUnpublished(html, new Date('2026-11-08T00:00:00Z'))).toBe(html)
    expect(unlinkUnpublished(html, new Date('2026-11-07T00:00:00Z'))).toBe('lien')
  })
})
