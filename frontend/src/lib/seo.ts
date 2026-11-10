import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { defaultLocale, ogLocale, unprefixedLocale, type Locale } from '@/i18n/config'

type BuildMetadataArgs = {
  title: string
  description: string
  path?: string
  image?: string
  /** Pixel size of `image`; defaults to the 1200x630 site default. */
  imageSize?: { width: number; height: number }
  type?: 'website' | 'article'
  noIndex?: boolean
  /** Active locale. Defaults to the site's default language. */
  locale?: Locale
  /** The page exists in this language only (e.g. a French article): no hreflang twin. */
  singleLocale?: boolean
}

/** Absolute URL for a path in a given locale (French pages live under /fr). */
export function localeUrl(path: string, locale: Locale): string {
  const prefix = locale === unprefixedLocale ? '' : `/${locale}`
  // Normalize the home path so canonicals match the sitemap ("/fr", not "/fr/").
  const suffix = path === '/' ? '' : path
  return `${siteConfig.url}${prefix}${suffix}`
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  imageSize = { width: 1200, height: 630 },
  type = 'website',
  noIndex = false,
  locale = defaultLocale,
  singleLocale = false,
}: BuildMetadataArgs): Metadata {
  const url = localeUrl(path, locale)
  const ogImage = image ?? `${siteConfig.url}/og-default.jpg`

  return {
    // Most page titles already end in "| Zad Academy"; letting the root layout's
    // `%s | Zad Academy` template run again would print the name twice.
    title: title.includes(siteConfig.name) ? { absolute: title } : title,
    description,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: url,
      // hreflang — tells search engines each page has an English and a French twin.
      ...(!singleLocale && {
        languages: {
          en: localeUrl(path, 'en'),
          fr: localeUrl(path, 'fr'),
          'x-default': localeUrl(path, defaultLocale),
        },
      }),
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: locale === 'fr' ? ogLocale.en : ogLocale.fr,
      images: [
        {
          url: ogImage,
          width: imageSize.width,
          height: imageSize.height,
          alt: `${siteConfig.name} — ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
