'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/i18n/MarketingI18nProvider'

type Heading = {
  id: string
  text: string
  level: 2 | 3
}

type Props = {
  html: string
}

function extractHeadings(html: string): Heading[] {
  if (typeof window === 'undefined') return []
  const div = document.createElement('div')
  div.innerHTML = html
  const headings: Heading[] = []
  div.querySelectorAll('h2, h3').forEach((el) => {
    const level = el.tagName === 'H2' ? 2 : 3
    const text = el.textContent?.trim() ?? ''
    const id = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (text) headings.push({ id, text, level })
  })
  return headings
}

export function TableOfContents({ html }: Props) {
  const { t } = useT()
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    setHeadings(extractHeadings(html))
  }, [html])

  if (headings.length < 3) return null

  return (
    <nav
      className="hidden lg:block sticky top-24 self-start bg-cream rounded-2xl p-6 border border-border-soft"
      aria-label={t('blogUi.tocAria')}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text mb-4">
        {t('blogUi.onThisPage')}
      </p>
      <ol className="space-y-2">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${h.id}`}
              className="text-sm text-muted-text hover:text-primary transition-colors leading-snug block"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
