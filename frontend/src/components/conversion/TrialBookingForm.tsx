'use client'

import { Check } from 'lucide-react'
import { QuickTrialForm } from './QuickTrialForm'
import { useT } from '@/i18n/MarketingI18nProvider'

// Ordered translation keys for the benefits list (free-trial highlight first).
const BENEFIT_KEYS = [
  'trialForm.benefit5',
  'trialForm.benefit1',
  'trialForm.benefit2',
  'trialForm.benefit3',
  'trialForm.benefit4',
] as const

/**
 * The free-trial booking block used on the homepage and the contact page: the
 * pitch on the left, the short WhatsApp booking form on the right.
 */
export function TrialBookingForm() {
  const { t } = useT()

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14 ring-1 ring-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      style={{ background: 'linear-gradient(135deg, #0a2f2d 0%, #072221 60%, #061e1d 100%)' }}
    >
      {/* Gold accent line across the top */}
      <span
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
        aria-hidden="true"
      />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ── Left: pitch + benefits ── */}
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t('trialForm.heading1')}
            <span className="text-accent">{t('trialForm.headingAccent')}</span>
            {t('trialForm.heading2')}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            {t('trialForm.subheading')}
          </p>

          <ul className="mt-7 space-y-3.5">
            {BENEFIT_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-500/90">
                  <Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: the short WhatsApp booking form ── */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
          <h3 className="text-center text-lg font-semibold text-white">{t('trialForm.quickTitle')}</h3>
          <p className="mb-5 mt-1.5 text-center text-xs leading-relaxed text-white/55">{t('trialForm.quickSub')}</p>
          <QuickTrialForm id="trial-form" />
        </div>
      </div>
    </div>
  )
}
