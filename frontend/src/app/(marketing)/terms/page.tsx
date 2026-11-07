import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/legal/LegalPage'
import { getTerms } from '@/content/legal'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = getT(locale)
  return buildMetadata({
    title: t('meta.termsTitle'),
    description: t('meta.termsDescription'),
    path: '/terms',
    locale,
  })
}

export default async function TermsPage() {
  const locale = await getLocale()
  return <LegalPage doc={getTerms(locale)} locale={locale} />
}
