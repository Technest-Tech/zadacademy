import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/legal/LegalPage'
import { getLegalNotice } from '@/content/legal'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = getT(locale)
  return buildMetadata({
    title: t('meta.legalNoticeTitle'),
    description: t('meta.legalNoticeDescription'),
    path: '/legal-notice',
    locale,
  })
}

export default async function LegalNoticePage() {
  const locale = await getLocale()
  return <LegalPage doc={getLegalNotice(locale)} locale={locale} />
}
