import { BlogCard } from './BlogCard'
import type { BlogPost } from '@/content/blog'
import type { Locale } from '@/i18n/config'
import { dictionaries, translate } from '@/i18n/translate'

type Props = {
  posts: BlogPost[]
  locale?: Locale
}

export function RelatedPosts({ posts, locale = 'en' }: Props) {
  if (posts.length === 0) return null
  const t = (key: string) => translate(dictionaries[locale], key)

  return (
    <section className="mt-16 pt-12 border-t border-border-soft">
      <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-2">
        {t('blogUi.keepReading')}
      </p>
      <h2 className="heading-xl font-display text-primary mb-8">{t('blogUi.moreArticles')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </section>
  )
}
