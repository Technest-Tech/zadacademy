// Marketing-site internationalization config.
// The admin console under (system) has its own separate i18n at src/lib/system/i18n.

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

/** The language shown to a visitor who has not chosen one. */
export const defaultLocale: Locale = 'fr'

/**
 * The language served from un-prefixed URLs (`/courses`); French lives under
 * `/fr`. This is about addresses only, and is deliberately separate from
 * `defaultLocale`: changing which language visitors see first must not move
 * every URL the site has already published and been indexed at.
 */
export const unprefixedLocale: Locale = 'en'

/** Request header the proxy attaches so server code can read the active locale. */
export const LOCALE_HEADER = 'x-locale'

/**
 * Cookie holding the language the visitor is browsing in. Written whenever a
 * language is resolved — by the `/fr` prefix, by the switcher, or by the first
 * redirect to the default — so a manual choice is never overruled on the next
 * page.
 *
 * Renamed from `zad.locale` when French became the default: that cookie also
 * recorded the result of the old country and browser detection, so it cannot
 * tell a visitor who picked English from one who was merely guessed to read it,
 * and honouring it would have kept them all on English for up to a year.
 */
export const LOCALE_COOKIE = 'zad.lang'

/** A year: the choice should outlive the visit that made it. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

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
