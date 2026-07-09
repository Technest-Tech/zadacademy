// Marketing-site internationalization config.
// The admin console under (system) has its own separate i18n at src/lib/system/i18n.

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Request header the proxy attaches so server code can read the active locale. */
export const LOCALE_HEADER = 'x-locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'fr'
}

/** BCP-47 tag for <html lang>, Intl formatting, and OpenGraph. */
export const localeTag: Record<Locale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
}

export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
}
