import Link from 'next/link'
import { BlogCover } from './BlogCover'
import { LinkButton } from '@/components/ui/link-button'
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
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function FeaturedPost({ post, locale = 'en' }: Props) {
  const t = (key: string, vars?: Record<string, string | number>) => translate(dictionaries[locale], key, vars)
  const primaryCategory = post.categories[0]

  return (
    <Link
      href={localizedHref(`/blog/${post.slug}`, locale)}
      className="group relative flex items-end rounded-3xl overflow-hidden min-h-[420px] bg-primary"
      aria-label={t('blogUi.readAria', { title: post.title })}
    >
      <BlogCover
        src={post.cover_image}
        priority
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />

      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5"
        aria-hidden="true"
      />

      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 70%, #C9A24B 0%, transparent 60%), radial-gradient(circle at 70% 30%, #0E7C5A 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          {primaryCategory && (
            <span className="bg-accent/20 text-accent text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wide">
              {primaryCategory.title}
            </span>
          )}
          <span className="text-white/60 text-sm">
            {t('blogUi.minRead', { n: post.reading_minutes })} · {formatDate(post.published_at, locale)}
          </span>
        </div>

        <h2 className="heading-xl font-display text-white leading-tight max-w-3xl group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="text-white/70 text-lg leading-relaxed max-w-2xl line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-2">
          <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all">
            {t('blogUi.readArticle')}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
