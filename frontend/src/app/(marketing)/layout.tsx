import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { MarketingI18nProvider } from '@/i18n/MarketingI18nProvider'
import { getLocale } from '@/i18n/getLocale'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <MarketingI18nProvider locale={locale}>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </MarketingI18nProvider>
  )
}
