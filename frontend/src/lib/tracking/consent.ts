/**
 * The visitor's cookie choice, kept in localStorage for six months (the CNIL's
 * recommended lifetime), after which the banner asks again.
 */

export type Consent = {
  analytics: boolean
  ads: boolean
  /** ISO date the choice was made. */
  at: string
}

const KEY = 'zad.consent'
const VERSION = 1
const MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000

/** Fired on window to reopen the banner (the footer's "Cookie settings" link). */
export const OPEN_CONSENT_EVENT = 'zad:open-consent'
/** Fired on window whenever the stored choice changes. */
const CHANGE_EVENT = 'zad:consent-change'

/** Fallback when storage is blocked: the choice still holds for this page view. */
let memory: string | null = null

function parse(raw: string | null): (Consent & { v: number }) | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Consent & { v: number }
    return parsed && parsed.v === VERSION ? parsed : null
  } catch {
    return null
  }
}

/**
 * The stored choice as a raw string, or null when there is none or it has
 * expired. A string, so `useSyncExternalStore` can compare snapshots by value.
 */
export function getConsentSnapshot(): string | null {
  let raw: string | null
  try {
    raw = localStorage.getItem(KEY) ?? memory
  } catch {
    raw = memory
  }
  const parsed = parse(raw)
  if (!parsed) return null
  if (Date.now() - new Date(parsed.at).getTime() > MAX_AGE_MS) return null
  return raw
}

export function consentFromSnapshot(raw: string | null): Consent | null {
  const parsed = parse(raw)
  return parsed ? { analytics: !!parsed.analytics, ads: !!parsed.ads, at: parsed.at } : null
}

export function readConsent(): Consent | null {
  return consentFromSnapshot(getConsentSnapshot())
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function saveConsent(choice: { analytics: boolean; ads: boolean }): Consent {
  const consent: Consent = { ...choice, at: new Date().toISOString() }
  memory = JSON.stringify({ v: VERSION, ...consent })
  try {
    localStorage.setItem(KEY, memory)
  } catch {
    // Storage blocked: `memory` keeps the choice for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
  return consent
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
