'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n/MarketingI18nProvider'
import { switchLocalePath } from '@/i18n/href'
import { locales, type Locale } from '@/i18n/config'

const LABELS: Record<Locale, string> = { en: 'EN', fr: 'FR' }

/**
 * Modern EN | FR segmented toggle. The URL is the single source of truth for
 * locale, so switching just navigates to the same path in the other language.
 */
export function LanguageSwitcher({
  className,
  variant = 'light',
}: {
  className?: string
  /** `light` = for dark/transparent backgrounds; `dark` = for light backgrounds. */
  variant?: 'light' | 'dark'
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { locale, t } = useT()
  const [isPending, startTransition] = useTransition()

  const go = (target: Locale) => {
    if (target === locale) return
    startTransition(() => router.push(switchLocalePath(pathname, target)))
  }

  const isLight = variant === 'light'

  return (
    <div
      role="group"
      aria-label={t('common.languageSwitcher')}
      data-pending={isPending ? '' : undefined}
      className={cn(
        'inline-flex items-center rounded-full p-0.5 text-xs font-semibold transition-colors',
        isLight ? 'bg-white/10 ring-1 ring-white/20' : 'bg-primary/5 ring-1 ring-primary/10',
        className,
      )}
    >
      {locales.map((l) => {
        const active = l === locale
        return (
          <button
            key={l}
            type="button"
            onClick={() => go(l)}
            aria-pressed={active}
            aria-label={t(l === 'fr' ? 'common.french' : 'common.english')}
            className={cn(
              'min-w-8 rounded-full px-2.5 py-1 transition-all duration-150',
              active
                ? isLight
                  ? 'bg-accent text-primary shadow-sm'
                  : 'bg-secondary text-white shadow-sm'
                : isLight
                  ? 'text-white/70 hover:text-white'
                  : 'text-primary/60 hover:text-primary',
            )}
          >
            {LABELS[l]}
          </button>
        )
      })}
    </div>
  )
}
