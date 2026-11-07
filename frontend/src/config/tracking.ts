/**
 * Advertising and analytics IDs for the public site.
 *
 * Paste each ID between the quotes (replacing ''), or set the matching
 * NEXT_PUBLIC_* variable on the server before `next build`. These IDs are
 * public — they appear in every visitor's browser — so keeping them in the repo
 * is fine.
 *
 * Nothing loads, and no cookie banner is shown, until at least one is set.
 * Even then, every tracker waits for the visitor's consent (see ConsentManager).
 */
export const trackingConfig = {
  /** Meta (Facebook + Instagram) Pixel — Events Manager → Data sources. Digits only. */
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  /** Google Analytics 4 measurement ID, e.g. G-ABC123XYZ. */
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || 'G-BSMP7RRT37', // GA4 property "Zad Academy - zadacademiq.com" (marketingacc095)
  /** Google Ads tag ID, e.g. AW-123456789. */
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18364672194', // Google Ads 244-721-4223
  /** Conversion label of the Google Ads "free trial booked" conversion action. */
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || '4IgSCJe2i7QdEMLR-rRE',
  /** Conversion label of the Google Ads "WhatsApp click" conversion action (optional). */
  googleAdsContactLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL || 'Cux0CJq2i7QdEMLR-rRE',
  /** TikTok Pixel ID — TikTok Ads Manager → Events. */
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
}

const hasAnalytics = Boolean(trackingConfig.ga4Id)
const hasAds = Boolean(
  trackingConfig.metaPixelId || trackingConfig.googleAdsId || trackingConfig.tiktokPixelId,
)

/** Which consent categories exist at all — no ID, no question to ask. */
export const trackingCategories = { analytics: hasAnalytics, ads: hasAds }

/** True when at least one third-party tracker is configured. */
export const hasTrackers = hasAnalytics || hasAds
