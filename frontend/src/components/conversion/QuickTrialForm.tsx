'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Baby, CheckCircle2, HelpCircle, Loader2, Lock, Send, User } from 'lucide-react'
import { PHONE_COUNTRIES, limitPhoneInput, maxTypedDigits, normalizeMobile } from './phoneCountries'
import { trackLead } from '@/lib/tracking/trackers'
import { whatsappLink } from '@/config/site'
import { courses, getCourses } from '@/content/courses'
import { navCourseSlugs } from '@/config/nav'
import { localizedHref } from '@/i18n/href'
import { useT } from '@/i18n/MarketingI18nProvider'
import { sendWeb3FormsNotification } from '@/lib/web3forms'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/** How long the booking may take to save in the CRM before we give up on it. */
const SAVE_TIMEOUT_MS = 8000
/** How long the academy's email notification may take before we give up on it. */
const NOTIFY_TIMEOUT_MS = 8000

/** Resolves true when `task` settles successfully within `ms`, false otherwise. */
function within(task: Promise<unknown>, ms: number): Promise<boolean> {
  return Promise.race([
    task.then(
      () => true,
      () => false,
    ),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), ms)),
  ])
}

type Audience = 'child' | 'adult'

/** The course choice for a visitor who doesn't know which course fits yet. */
const HELP_ME_CHOOSE = 'Help me choose'
type Errors = Partial<Record<'name' | 'phone' | 'audience' | 'course', string>>

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.25-9.46 9.48-9.46 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.52A11.33 11.33 0 0 0 12.04.64C5.77.64.66 5.75.66 12.02c0 2 .52 3.96 1.52 5.69L.57 23.6l6.03-1.58a11.36 11.36 0 0 0 5.43 1.38h.01c6.27 0 11.38-5.11 11.38-11.38 0-3.04-1.18-5.9-3.33-8.04z" />
    </svg>
  )
}

/**
 * The short booking form: first name, WhatsApp number, child or adult — and the
 * course, unless the page already says which one. Submitting saves the lead in
 * the CRM (when the API answers in time) and then opens WhatsApp with
 * everything pre-filled, so the visitor finishes booking in a conversation.
 * Visitors who would rather not fill anything get a direct WhatsApp link.
 *
 * Every pre-filled WhatsApp message is in French, on the English pages too
 * (see config/site.ts).
 */
export function QuickTrialForm({ courseSlug, id }: { courseSlug?: string; id?: string }) {
  const { t, locale } = useT()
  const localized = useMemo(() => getCourses(locale), [locale])

  // The four offered courses, as chips — only shown when the page has no course.
  const courseOptions = useMemo(
    () =>
      courses.flatMap((c, i) =>
        (navCourseSlugs as readonly string[]).includes(c.slug)
          ? [{ slug: c.slug, value: c.title, label: localized[i].title }]
          : [],
      ),
    [localized],
  )

  const fixedCourse = useMemo(() => {
    if (!courseSlug) return null
    const i = courses.findIndex((c) => c.slug === courseSlug)
    if (i < 0) return null
    // The French title goes into the WhatsApp message whatever the page language.
    const fr = getCourses('fr')[i]
    return { value: courses[i].title, label: localized[i].title, fr: fr.title }
  }, [courseSlug, localized])

  const [name, setName] = useState('')
  const [country, setCountry] = useState<string>(PHONE_COUNTRIES[0].code)
  const [phone, setPhone] = useState('')
  const [audience, setAudience] = useState<Audience | null>(null)
  const [chosenCourse, setChosenCourse] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState<{
    name: string
    phone: string
    reference: string | null
  } | null>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (done)
      successRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }, [done])

  const dial = PHONE_COUNTRIES.find((c) => c.code === country) ?? PHONE_COUNTRIES[0]

  const frCourseTitle = (value: string) => {
    if (value === HELP_ME_CHOOSE) return 'À définir — aidez-moi à choisir'
    const i = courses.findIndex((c) => c.title === value)
    return i < 0 ? value : getCourses('fr')[i].title
  }

  const directHref = whatsappLink(
    fixedCourse ? t('trialForm.waDirectCourse', { course: fixedCourse.fr }) : t('trialForm.waDirectGeneric'),
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return

    const courseValue = fixedCourse?.value ?? chosenCourse
    const national = normalizeMobile(phone, dial)
    const next: Errors = {}
    if (name.trim().length < 2) next.name = t('trialForm.nameRequired')
    if (!phone.trim()) next.phone = t('trialForm.phoneRequired')
    else if (!national)
      next.phone = t('trialForm.phoneInvalid', {
        example: `${dial.dial} ${dial.example}`,
      })
    if (!audience) next.audience = t('trialForm.audienceRequired')
    if (!courseValue) next.course = t('trialForm.courseRequired')
    setErrors(next)
    if (Object.keys(next).length > 0 || !audience || !courseValue || !national) return

    setBusy(true)
    setFormError(null)
    const fullPhone = `${dial.dial} ${national}`
    const firstName = name.trim()
    let timezone = 'UTC'
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
      // Intl unavailable — keep UTC
    }

    // 1. Save the lead in the CRM — never keeping the visitor waiting more
    //    than SAVE_TIMEOUT_MS.
    let reference: string | null = null
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS)
    try {
      const res = await fetch(`${API_URL}/api/v1/trial-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: firstName,
          country: dial.code,
          phone: fullPhone,
          ageGroup: audience === 'adult' ? 'adult' : 'kid-9-12',
          courseInterest: courseValue,
          preferredTime: 'flexible',
          timezone,
          message: 'Réservation rapide — à recontacter sur WhatsApp',
        }),
      })
      if (res.ok) {
        reference = ((await res.json()) as { reference: string }).reference
        trackLead({ reference, course: courseValue })
      }
    } catch {
      // Offline, slow or refused: the email below still tells the academy.
    } finally {
      clearTimeout(timer)
    }

    // 2. Email the academy about every booking — also when the CRM did not
    //    answer, so no visitor is lost.
    const notify = sendWeb3FormsNotification({
      subject: `[Nouvelle réservation] ${firstName} — ${frCourseTitle(courseValue)}`,
      form_name: 'Réservation rapide (WhatsApp)',
      reference: reference ?? 'NON ENREGISTRÉE DANS LE CRM — à saisir à la main',
      name: firstName,
      phone: fullPhone,
      // A national number typed with its leading 0 (06…) drops it after the dial code.
      whatsapp: `https://wa.me/${dial.dial.replace('+', '')}${national}`,
      country: dial.name,
      audience: audience === 'adult' ? 'Adulte' : 'Enfant',
      course: frCourseTitle(courseValue),
      language: locale.toUpperCase(),
      page_url: window.location.href,
    })
    const emailed = await within(notify, NOTIFY_TIMEOUT_MS)

    setBusy(false)
    // Neither the CRM nor the email reached the academy: say so, keep what was typed.
    if (!reference && !emailed) {
      setFormError(t('trialForm.errorGeneric'))
      return
    }
    setDone({ name: firstName, phone: fullPhone, reference })
  }

  const startOver = () => {
    setName('')
    setPhone('')
    setAudience(null)
    setChosenCourse(null)
    setErrors({})
    setDone(null)
  }

  const field =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-white/40 outline-none transition-colors focus:border-accent/70 focus:ring-2 focus:ring-accent/20 disabled:opacity-50'
  const label = 'mb-1.5 block text-xs font-medium text-white/70'
  const err = (m?: string) =>
    m ? (
      <p role="alert" className="mt-1 text-xs text-red-300">
        {m}
      </p>
    ) : null

  return (
    <div id={id} className="scroll-mt-28">
      {done ? (
        <div
          ref={successRef}
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-accent/40 bg-accent/10 px-5 py-8 text-center"
        >
          <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-bold text-white">{t('trialForm.successTitle', { name: done.name })}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {t('trialForm.successBody', { phone: done.phone })}
          </p>
          {done.reference && (
            <p className="mt-3 text-xs text-white/60">
              {t('trialForm.successReference')}{' '}
              <span className="font-mono font-semibold text-white">{done.reference}</span>
            </p>
          )}
          <button
            type="button"
            onClick={startOver}
            className="mt-6 text-sm font-medium text-accent underline underline-offset-2 hover:text-white"
          >
            {t('trialForm.successAgain')}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor={`${id ?? 'qb'}-name`} className={label}>
              {t('trialForm.firstNameLabel')}
            </label>
            <input
              id={`${id ?? 'qb'}-name`}
              type="text"
              autoComplete="given-name"
              placeholder={t('trialForm.firstNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              aria-invalid={!!errors.name}
              className={field}
            />
            {err(errors.name)}
          </div>

          <div>
            <label htmlFor={`${id ?? 'qb'}-phone`} className={label}>
              {t('trialForm.whatsappLabel')}
            </label>
            <div className="flex gap-2">
              <select
                aria-label={t('trialForm.dialCodeAria')}
                value={country}
                onChange={(e) => {
                  const nextDial = PHONE_COUNTRIES.find((c) => c.code === e.target.value) ?? PHONE_COUNTRIES[0]
                  setCountry(nextDial.code)
                  setPhone((p) => limitPhoneInput(p, nextDial))
                  setErrors((er) => ({ ...er, phone: undefined }))
                }}
                disabled={busy}
                className="shrink-0 rounded-xl border border-white/15 bg-white/[0.06] px-2 py-3 text-base text-white outline-none focus:border-accent/70 disabled:opacity-50"
              >
                {PHONE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="text-black">
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                id={`${id ?? 'qb'}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={dial.example}
                value={phone}
                // Digits and spaces only, never longer than the country's numbers (plus a leading 0).
                maxLength={maxTypedDigits(dial) * 2}
                onChange={(e) => {
                  setPhone(limitPhoneInput(e.target.value, dial))
                  if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }))
                }}
                disabled={busy}
                aria-invalid={!!errors.phone}
                className={field}
              />
            </div>
            {err(errors.phone)}
          </div>

          <div>
            <span className={label}>{t('trialForm.audienceLabel')}</span>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    value: 'child',
                    text: t('trialForm.audienceChild'),
                    Icon: Baby,
                  },
                  {
                    value: 'adult',
                    text: t('trialForm.audienceAdult'),
                    Icon: User,
                  },
                ] as const
              ).map(({ value, text, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAudience(value)}
                  aria-pressed={audience === value}
                  disabled={busy}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors disabled:opacity-50 ${
                    audience === value
                      ? 'border-accent bg-accent/15 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30'
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {text}
                </button>
              ))}
            </div>
            {err(errors.audience)}
          </div>

          {!fixedCourse && (
            <div>
              <span className={label}>{t('trialForm.courseLabel')}</span>
              <div className="grid grid-cols-2 gap-2">
                {courseOptions.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setChosenCourse(c.value)}
                    aria-pressed={chosenCourse === c.value}
                    disabled={busy}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium leading-snug transition-colors disabled:opacity-50 ${
                      chosenCourse === c.value
                        ? 'border-accent bg-accent/15 text-white'
                        : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setChosenCourse(HELP_ME_CHOOSE)}
                  aria-pressed={chosenCourse === HELP_ME_CHOOSE}
                  disabled={busy}
                  className={`col-span-2 flex items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-sm font-medium leading-snug transition-colors disabled:opacity-50 ${
                    chosenCourse === HELP_ME_CHOOSE
                      ? 'border-accent bg-accent/15 text-white'
                      : 'border-white/25 bg-white/[0.02] text-white/80 hover:border-white/40'
                  }`}
                >
                  <HelpCircle className="size-4" aria-hidden="true" />
                  {t('trialForm.courseHelpMeChoose')}
                </button>
              </div>
              {err(errors.course)}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-4 py-4 text-base font-bold text-primary shadow-lg shadow-black/30 transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
          >
            {busy ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                {t('trialForm.submitting')}
              </>
            ) : (
              <>
                <Send className="size-5" aria-hidden="true" />
                {t('trialForm.quickSubmit')}
              </>
            )}
          </button>

          {formError && (
            <p role="alert" className="text-center text-sm text-red-300">
              {formError}
            </p>
          )}
        </form>
      )}

      <div className="mt-5 border-t border-white/10 pt-4 text-center">
        <a
          href={directHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4ade80] hover:text-[#86efac]"
        >
          <WhatsAppIcon className="size-4" />
          {t('trialForm.directWhatsapp')}
        </a>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/45">
          <Lock className="size-3 shrink-0" aria-hidden="true" />
          <span>
            {t('trialForm.secureNote')}{' '}
            <Link href={localizedHref('/privacy', locale)} className="underline underline-offset-2 hover:text-white/70">
              {t('trialForm.privacyLink')}
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
