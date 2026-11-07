import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/legal/LegalPage'
import { getPrivacyPolicy } from '@/content/legal'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = getT(locale)
  return buildMetadata({
    title: t('meta.privacyTitle'),
    description: t('meta.privacyDescription'),
    path: '/privacy',
    locale,
  })
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  return <LegalPage doc={getPrivacyPolicy(locale)} locale={locale} />
}
