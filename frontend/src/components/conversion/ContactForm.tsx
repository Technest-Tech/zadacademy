'use client'

import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { SuccessState } from './SuccessState'
import { TurnstileWidget } from './TurnstileWidget'
import { useT } from '@/i18n/MarketingI18nProvider'
import type { TranslateFn } from '@/i18n/translate'

// Cloudflare Turnstile is optional: the captcha only appears (and is required)
// when a site key is configured. Without one, the form submits without it and
// the backend skips verification too.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const CAPTCHA_ENABLED = Boolean(SITE_KEY)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const makeSchema = (t: TranslateFn) =>
  z
    .object({
      name: z.string().min(2, t('contactForm.nameRequired')),
      email: z.string().email(t('contactForm.emailInvalid')),
      subject: z.string().min(3, t('contactForm.subjectRequired')),
      message: z.string().min(10, t('contactForm.messageMin')),
      turnstileToken: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      if (CAPTCHA_ENABLED && !val.turnstileToken) {
        ctx.addIssue({
          code: 'custom',
          message: t('contactForm.captchaRequired'),
          path: ['turnstileToken'],
        })
      }
    })

type FormValues = z.infer<ReturnType<typeof makeSchema>>

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const { t, locale } = useT()
  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const schema = useMemo(() => makeSchema(t), [locale])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const handleTurnstileSuccess = useCallback(
    (token: string) => setValue('turnstileToken', token),
    [setValue],
  )

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${API_URL}/api/v1/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { message?: string }).message ?? t('contactForm.errorGeneric'))
      }
      const json = (await res.json()) as { reference: string }
      setReference(json.reference)
      setStatus('success')
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : t('contactForm.errorGeneric'))
    }
  }

  if (status === 'success') {
    return <SuccessState type="contact" reference={reference} />
  }

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          id="contact-name"
          label={t('contactForm.nameLabel')}
          required
          placeholder={t('contactForm.namePlaceholder')}
          error={errors.name?.message}
          disabled={isLoading}
          {...register('name')}
        />
        <FormField
          id="contact-email"
          label={t('contactForm.emailLabel')}
          type="email"
          required
          placeholder={t('contactForm.emailPlaceholder')}
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />
      </div>

      <FormField
        id="contact-subject"
        label={t('contactForm.subjectLabel')}
        required
        placeholder={t('contactForm.subjectPlaceholder')}
        error={errors.subject?.message}
        disabled={isLoading}
        {...register('subject')}
      />

      <FormField
        id="contact-message"
        label={t('contactForm.messageLabel')}
        as="textarea"
        required
        placeholder={t('contactForm.messagePlaceholder')}
        rows={4}
        error={errors.message?.message}
        disabled={isLoading}
        {...register('message')}
      />

      {CAPTCHA_ENABLED && (
        <div>
          <TurnstileWidget siteKey={SITE_KEY!} onSuccess={handleTurnstileSuccess} />
          {errors.turnstileToken && (
            <p role="alert" aria-live="polite" className="text-destructive text-sm mt-1">
              {errors.turnstileToken.message}
            </p>
          )}
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        size="default"
        className="w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t('contactForm.submitting')}
          </>
        ) : (
          t('contactForm.submit')
        )}
      </Button>
    </form>
  )
}
