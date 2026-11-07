import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { dictionaries, translate } from '@/i18n/translate'

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
  category?: string | null
  locale?: Locale
}

function buildHref(basePath: string, page: number, category?: string | null): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (category) params.set('category', category)
  return `${basePath}?${params.toString()}`
}

export function Pagination({ currentPage, totalPages, basePath, category, locale = 'en' }: Props) {
  if (totalPages <= 1) return null
  const t = (key: string, vars?: Record<string, string | number>) => translate(dictionaries[locale], key, vars)

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav className="flex items-center justify-center gap-4 pt-8" aria-label={t('blogUi.pagination')}>
      {hasPrev ? (
        <Link
          href={buildHref(basePath, currentPage - 1, category)}
          className="flex items-center gap-2 rounded-xl border border-border-soft px-5 py-2.5 text-sm font-medium text-primary hover:border-primary transition-colors"
        >
          {t('blogUi.previous')}
        </Link>
      ) : (
        <span className="flex items-center gap-2 rounded-xl border border-border-soft px-5 py-2.5 text-sm font-medium text-muted-text cursor-not-allowed opacity-50">
          {t('blogUi.previous')}
        </span>
      )}

      <span className="text-sm text-muted-text" aria-current="page">
        {t('blogUi.pageOf', { page: currentPage, total: totalPages })}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(basePath, currentPage + 1, category)}
          className="flex items-center gap-2 rounded-xl border border-border-soft px-5 py-2.5 text-sm font-medium text-primary hover:border-primary transition-colors"
        >
          {t('blogUi.next')}
        </Link>
      ) : (
        <span className="flex items-center gap-2 rounded-xl border border-border-soft px-5 py-2.5 text-sm font-medium text-muted-text cursor-not-allowed opacity-50">
          {t('blogUi.next')}
        </span>
      )}
    </nav>
  )
}
