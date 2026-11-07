/**
 * Loads the third-party trackers a visitor agreed to, and sends conversion
 * events to them. Nothing here runs before consent: ConsentManager calls
 * `startTrackers` only with a saved choice, and the `track*` helpers re-check it.
 */
import { trackingConfig } from '@/config/tracking'
import { readConsent, type Consent } from './consent'

type Fn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Fn
    fbq?: Fn
    ttq?: { page: Fn; track: Fn }
  }
}

/**
 * The page the visitor first landed on, kept in memory only (nothing is stored
 * on the device before consent), when it carries a Google Ads click id. A
 * visitor who arrives from an ad and opens another page before answering the
 * banner would otherwise lose the id, and their booking would never be credited
 * to the ad.
 */
const AD_CLICK_PARAMS = ['gclid', 'gbraid', 'wbraid']
const adLandingUrl: string | null = (() => {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return AD_CLICK_PARAMS.some((p) => params.has(p)) ? window.location.href : null
})()

/** Only ever interpolate IDs that look like IDs into inline scripts. */
const SAFE_ID = /^[A-Za-z0-9-]+$/

function inlineScript(id: string, code: string) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.text = code
  document.head.appendChild(s)
}

function externalScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

function startGoogle(consent: Consent) {
  const { ga4Id, googleAdsId } = trackingConfig
  const ids = [consent.analytics && ga4Id, consent.ads && googleAdsId].filter(
    (id): id is string => Boolean(id && SAFE_ID.test(id)),
  )
  if (ids.length === 0 || window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js expects the Arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  const granted = (yes: boolean) => (yes ? 'granted' : 'denied')
  // Google Consent Mode v2 — required for ads measurement in the EEA.
  window.gtag('consent', 'default', {
    ad_storage: granted(consent.ads),
    ad_user_data: granted(consent.ads),
    ad_personalization: granted(consent.ads),
    analytics_storage: granted(consent.analytics),
  })
  window.gtag('js', new Date())
  for (const id of ids) {
    // Google Ads reads the click id from the page URL; hand it the landing page
    // when the visitor has since moved on. Analytics keeps the real page.
    const passLanding = id === googleAdsId && adLandingUrl && adLandingUrl !== window.location.href
    window.gtag('config', id, passLanding ? { page_location: adLandingUrl } : {})
  }
  externalScript(`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`)
}

function startMeta() {
  const id = trackingConfig.metaPixelId
  if (!id || !SAFE_ID.test(id)) return
  // Meta's official base code. It also records later client-side navigations
  // (history.pushState) as page views on its own.
  inlineScript(
    'meta-pixel',
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
  )
}

function startTikTok() {
  const id = trackingConfig.tiktokPixelId
  if (!id || !SAFE_ID.test(id)) return
  // TikTok's official base code.
  inlineScript(
    'tiktok-pixel',
    `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${id}');ttq.page();}(window,document,'ttq');`,
  )
}

/** Load every tracker the visitor agreed to. Safe to call more than once. */
export function startTrackers(consent: Consent) {
  startGoogle(consent)
  if (consent.ads) {
    startMeta()
    startTikTok()
  }
}

/**
 * Report a client-side navigation. Google Analytics and Meta pick these up on
 * their own from the browser history; TikTok needs to be told.
 */
export function trackPageView() {
  if (readConsent()?.ads) window.ttq?.page()
}

/** A free-trial booking was saved. `reference` doubles as the dedup id. */
export function trackLead({ reference, course }: { reference: string; course: string }) {
  const consent = readConsent()
  if (!consent) return
  const { ga4Id, googleAdsId, googleAdsLeadLabel } = trackingConfig
  if (consent.ads) {
    window.fbq?.('track', 'Lead', { content_name: course }, { eventID: reference })
    window.ttq?.track('SubmitForm', { content_name: course, event_id: reference })
    if (googleAdsId && googleAdsLeadLabel) {
      window.gtag?.('event', 'conversion', {
        send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
        transaction_id: reference,
      })
    }
  }
  if (consent.analytics && ga4Id) {
    window.gtag?.('event', 'generate_lead', { course, reference })
  }
}

/** A visitor opened a WhatsApp chat with the academy. */
export function trackWhatsAppClick(page: string) {
  const consent = readConsent()
  if (!consent) return
  const { ga4Id, googleAdsId, googleAdsContactLabel } = trackingConfig
  if (consent.ads) {
    window.fbq?.('track', 'Contact', { content_name: page })
    window.ttq?.track('Contact', { content_name: page })
    if (googleAdsId && googleAdsContactLabel) {
      window.gtag?.('event', 'conversion', { send_to: `${googleAdsId}/${googleAdsContactLabel}` })
    }
  }
  if (consent.analytics && ga4Id) {
    window.gtag?.('event', 'contact', { method: 'whatsapp', page })
  }
}
