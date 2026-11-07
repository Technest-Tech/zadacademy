'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { hasTrackers, trackingCategories } from '@/config/tracking'
import { useT } from '@/i18n/MarketingI18nProvider'
import { localizedHref } from '@/i18n/href'
import {
  OPEN_CONSENT_EVENT,
  consentFromSnapshot,
  getConsentSnapshot,
  saveConsent,
  subscribeConsent,
  type Consent,
} from '@/lib/tracking/consent'
import { startTrackers, trackPageView, trackWhatsAppClick } from '@/lib/tracking/trackers'

/** Server render and hydration: the stored choice is unknown, so show nothing. */
const UNKNOWN = undefined

/**
 * Cookie banner and the switch that turns third-party trackers on.
 *
 * Follows the CNIL's rules: nothing loads before a choice, refusing is as easy
 * as accepting, and the choice can be changed from every page (footer link).
 * Renders nothing at all while no tracker ID is configured.
 */
export function ConsentManager() {
  const { t, locale } = useT()
  const pathname = usePathname()
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => UNKNOWN)
  const consent = useMemo(() => (raw === UNKNOWN ? UNKNOWN : consentFromSnapshot(raw)), [raw])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [ads, setAds] = useState(false)
  const firstPath = useRef<string | null>(null)

  // Start the trackers the visitor agreed to — on load, and right after a choice.
  useEffect(() => {
    if (hasTrackers && consent) startTrackers(consent)
  }, [consent])

  const openSettings = useCallback(() => {
    const saved = consentFromSnapshot(getConsentSnapshot())
    setAnalytics(saved?.analytics ?? false)
    setAds(saved?.ads ?? false)
    setSettingsOpen(true)
  }, [])

  // Reopen from the footer's "Cookie settings" link.
  useEffect(() => {
    if (!hasTrackers) return
    window.addEventListener(OPEN_CONSENT_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openSettings)
  }, [openSettings])

  // Page views after the first one (client-side navigation).
  useEffect(() => {
    if (!hasTrackers || !pathname) return
    if (firstPath.current === null) {
      firstPath.current = pathname
      return
    }
    trackPageView()
  }, [pathname])

  // Every WhatsApp link on the site counts as a "Contact" conversion.
  useEffect(() => {
    if (!hasTrackers) return
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]')
      if (link) trackWhatsAppClick(window.location.pathname)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  const decide = useCallback(
    (choice: Pick<Consent, 'analytics' | 'ads'>) => {
      const previous = consent
      saveConsent(choice)
      setSettingsOpen(false)
      // Trackers cannot be unloaded from a running page: withdrawing consent
      // reloads it so they are simply never started again.
      if ((previous?.analytics && !choice.analytics) || (previous?.ads && !choice.ads)) {
        window.location.reload()
      }
    },
    [consent],
  )

  const view = !hasTrackers || consent === UNKNOWN
    ? 'hidden'
    : settingsOpen
      ? 'settings'
      : consent
        ? 'hidden'
        : 'banner'

  if (!hasTrackers || view === 'hidden') return null

  const all = { analytics: trackingCategories.analytics, ads: trackingCategories.ads }
  const none = { analytics: false, ads: false }
  const btn =
    'inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors'

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-white/15 bg-primary/95 p-5 text-white shadow-2xl shadow-black/40 backdrop-blur sm:inset-x-auto sm:left-6 sm:bottom-6"
    >
      <p id="consent-title" className="font-display text-lg text-white">
        {t('consent.title')}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-white/70">
        {t('consent.body')}{' '}
        <Link href={localizedHref('/privacy', locale)} className="text-accent underline underline-offset-2">
          {t('consent.learnMore')}
        </Link>
      </p>

      {view === 'settings' && (
        <ul className="mt-4 space-y-3 text-sm" role="list">
          <li className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-3">
            <span>
              <span className="block font-semibold">{t('consent.necessaryTitle')}</span>
              <span className="block text-xs text-white/60">{t('consent.necessaryBody')}</span>
            </span>
            <span className="shrink-0 text-xs text-accent">{t('consent.alwaysOn')}</span>
          </li>
          {trackingCategories.analytics && (
            <Toggle
              title={t('consent.analyticsTitle')}
              body={t('consent.analyticsBody')}
              checked={analytics}
              onChange={setAnalytics}
            />
          )}
          {trackingCategories.ads && (
            <Toggle
              title={t('consent.adsTitle')}
              body={t('consent.adsBody')}
              checked={ads}
              onChange={setAds}
            />
          )}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {/* Refusing is exactly as easy as accepting: same size, same row. */}
        <button type="button" onClick={() => decide(none)} className={`${btn} border border-white/30 hover:border-accent hover:text-accent`}>
          {t('consent.rejectAll')}
        </button>
        <button type="button" onClick={() => decide(all)} className={`${btn} bg-accent text-primary hover:bg-accent/90`}>
          {t('consent.acceptAll')}
        </button>
      </div>
      {view === 'banner' ? (
        <button
          type="button"
          onClick={openSettings}
          className="mt-2 w-full text-center text-xs text-white/60 underline underline-offset-2 hover:text-white"
        >
          {t('consent.customize')}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => decide({ analytics, ads })}
          className={`${btn} mt-2 w-full border border-accent/60 text-accent hover:bg-accent/10`}
        >
          {t('consent.save')}
        </button>
      )}
    </div>
  )
}

function Toggle({
  title,
  body,
  checked,
  onChange,
}: {
  title: string
  body: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-white/5 p-3">
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="block text-xs text-white/60">{body}</span>
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 size-5 shrink-0 accent-[#C9A24B]"
        />
      </label>
    </li>
  )
}
