'use client'

import { hasTrackers } from '@/config/tracking'
import { openConsentSettings } from '@/lib/tracking/consent'

/** Footer link that reopens the cookie banner. Hidden while no tracker is configured. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  if (!hasTrackers) return null
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  )
}
