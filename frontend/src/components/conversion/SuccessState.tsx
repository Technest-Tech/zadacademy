'use client'

import { CheckCircle2 } from 'lucide-react'
import { whatsappLink } from '@/config/site'
import { useT } from '@/i18n/MarketingI18nProvider'

type SuccessStateProps = {
  reference: string
  type: 'trial' | 'contact'
}

export function SuccessState({ reference, type }: SuccessStateProps) {
  const { t } = useT()

  const waMessage =
    type === 'trial'
      ? t('success.waTrial', { ref: reference })
      : t('success.waContact', { ref: reference })

  return (
    <div className="text-center py-12 px-6 max-w-md mx-auto" role="status" aria-live="polite">
      <div className="size-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="size-8 text-secondary" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-primary mb-2">
        {type === 'trial' ? t('success.titleTrial') : t('success.titleContact')}
      </h2>
      <p className="text-muted-foreground mb-1">{t('success.referenceLabel')}</p>
      <p className="font-mono text-lg font-semibold text-primary mb-4">{reference}</p>
      <p className="text-muted-foreground text-sm mb-8">
        {type === 'trial' ? t('success.bodyTrial') : t('success.bodyContact')}
      </p>
      <a
        href={whatsappLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1da851] transition-colors"
      >
        {t('success.continueWhatsapp')}
      </a>
    </div>
  )
}
