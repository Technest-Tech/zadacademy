import Link from 'next/link'
import { BlogCover } from './BlogCover'
import type { BlogPost } from '@/content/blog'
import type { Locale } from '@/i18n/config'
import { localeTag } from '@/i18n/config'
import { localizedHref } from '@/i18n/href'
import { dictionaries, translate } from '@/i18n/translate'

type Props = {
  post: BlogPost
  locale?: Locale
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function BlogCard({ post, locale = 'en' }: Props) {
  const t = (key: string, vars?: Record<string, string | number>) => translate(dictionaries[locale], key, vars)
  const primaryCategory = post.categories[0]

  return (
    <Link
      href={localizedHref(`/blog/${post.slug}`, locale)}
      className="group flex flex-col rounded-2xl border border-border-soft bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Cover */}
      <div className="aspect-video bg-primary/10 flex items-center justify-center relative overflow-hidden">
        {post.cover_image ? (
          <BlogCover
            src={post.cover_image}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-4xl opacity-20 select-none">📖</span>
        )}
        {primaryCategory && (
          <span className="absolute top-3 left-3 z-10 bg-white/90 text-secondary text-xs font-semibold rounded-full px-2.5 py-1 shadow-sm">
            {primaryCategory.title}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-display font-semibold text-primary leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-text text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-text pt-1 border-t border-border-soft">
          <span>{t('blogUi.minRead', { n: post.reading_minutes })}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.published_at, locale)}</span>
        </div>
      </div>
    </Link>
  )
}
