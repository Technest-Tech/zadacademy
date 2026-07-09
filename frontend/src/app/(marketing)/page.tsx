import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { organizationSchema } from '@/lib/schema'
import { SectionDivider } from '@/components/layout/SectionDivider'
import { Container } from '@/components/layout/Container'
import { LinkButton } from '@/components/ui/link-button'
import { Hero } from '@/components/home/Hero'
import { StatsSection } from '@/components/home/StatsSection'
import { CoursesGrid } from '@/components/home/CoursesGrid'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { TeachersSection } from '@/components/home/TeachersSection'
import { TrialBookingForm } from '@/components/conversion/TrialBookingForm'
import { whatsappLink } from '@/config/site'
import { getHomeContent } from '@/content/home'
import { getStats } from '@/content/stats'
import Image from 'next/image'
import { getCourses } from '@/content/courses'
import { getTestimonials } from '@/content/testimonials'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'
import { localizedHref } from '@/i18n/href'
import {
  BookOpen,
  Users,
  Globe,
  Star,
  ShieldCheck,
  GraduationCap,
  Heart,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = getT(locale)
  return buildMetadata({
    title: t('meta.homeTitle'),
    description: t('meta.homeDescription'),
    path: '/',
    locale,
  })
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  Globe,
  Heart,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Clock,
}

export default async function HomePage() {
  const locale = await getLocale()
  const t = getT(locale)
  const homeContent = getHomeContent(locale)
  const stats = getStats(locale)
  const courses = getCourses(locale)
  const testimonials = getTestimonials(locale)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />

      {/* ── Hero ── */}
      <Hero />


      {/* ── Trust Strip ── */}
      <section className="bg-cream py-10 md:py-12" aria-label={t('home.whyChooseAria')}>
        <Container>
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-7">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-accent/60" aria-hidden="true" />
            <span className="size-1.5 rotate-45 rounded-[1px] bg-accent" aria-hidden="true" />
            <p className="text-secondary text-sm font-semibold uppercase tracking-[0.2em] text-center">
              {homeContent.whyUs.eyebrow}
            </p>
            <span className="size-1.5 rotate-45 rounded-[1px] bg-accent" aria-hidden="true" />
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-accent/60" aria-hidden="true" />
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4" role="list">
            {homeContent.trustBadges.map(({ icon, label }, idx) => {
              const Icon = iconMap[icon] ?? BookOpen
              // t() echoes the key back when a lookup misses — treat that as "no subtext".
              const subtextKey = `home.trustSubtext.${icon}`
              const resolved = t(subtextKey)
              const subtext = resolved === subtextKey ? '' : resolved
              const iconStyle: Record<string, { wrap: string; icon: string }> = {
                'Users':         { wrap: 'bg-secondary/12', icon: 'text-secondary' },
                'ShieldCheck':   { wrap: 'bg-accent/12',    icon: 'text-accent'    },
                'Heart':         { wrap: 'bg-secondary/12', icon: 'text-secondary' },
                'Globe':         { wrap: 'bg-accent/12',    icon: 'text-accent'    },
                'GraduationCap': { wrap: 'bg-secondary/12', icon: 'text-secondary' },
              }
              const { wrap, icon: iconCls } = iconStyle[icon] ?? { wrap: 'bg-secondary/12', icon: 'text-secondary' }
              const isLastOrphan =
                idx === homeContent.trustBadges.length - 1 && homeContent.trustBadges.length % 2 !== 0
              return (
                <li
                  key={label}
                  className={`group flex flex-col items-center text-center gap-3.5 rounded-2xl border border-border-soft bg-white px-4 py-7 shadow-[0_2px_12px_rgba(11,31,58,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_32px_rgba(11,31,58,0.10)] ${isLastOrphan ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <div className={`shrink-0 size-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${wrap}`}>
                    <Icon className={`size-6 ${iconCls}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm leading-snug">{label}</p>
                    <p className="text-muted-text text-xs mt-1 leading-snug">{subtext}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      {/* ── Stats (client component — scroll-animated counters) ── */}
      <StatsSection stats={stats} />

      {/* ── Testimonials (directly below stats) ── */}
      <TestimonialsMarquee items={testimonials} locale={locale} />

      {/* ── How It Works ── */}
      <section className="relative overflow-hidden bg-navy-soft py-12 sm:py-14" aria-labelledby="how-heading">
        {/* Islamic geometric star pattern */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="how-stars" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                {/* Eight-pointed star (two overlapping squares) */}
                <rect x="21" y="21" width="48" height="48" fill="none" stroke="#C9A24B" strokeWidth="1" />
                <path d="M45 12 78 45 45 78 12 45 Z" fill="none" stroke="#C9A24B" strokeWidth="1" />
                <circle cx="45" cy="45" r="6" fill="none" stroke="#C9A24B" strokeWidth="1" />
                {/* Corner nodes for interlace feel */}
                <circle cx="0"  cy="0"  r="2.5" fill="#C9A24B" opacity="0.6" />
                <circle cx="90" cy="0"  r="2.5" fill="#C9A24B" opacity="0.6" />
                <circle cx="0"  cy="90" r="2.5" fill="#C9A24B" opacity="0.6" />
                <circle cx="90" cy="90" r="2.5" fill="#C9A24B" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#how-stars)" />
          </svg>
        </div>
        {/* Warm radial glow for depth */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(201,162,75,0.12), transparent 70%)' }}
        />

        <Container className="relative">
          <SectionDivider tone="dark" className="mb-6 -mt-2" />
          <div className="text-center mb-6">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">{t('home.simpleProcess')}</p>
            <h2 id="how-heading" className="heading-xl font-heading text-white">
              {t('home.startSteps')}
            </h2>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/contact-trial-steps.png"
              alt={t('home.stepsAlt')}
              width={900}
              height={320}
              className="w-full max-w-3xl h-auto rounded-2xl"
            />
          </div>
        </Container>
      </section>

      {/* ── Courses ── */}
      <CoursesGrid courses={courses} locale={locale} />

      {/* ── Teachers ── */}
      <TeachersSection />

      {/* ── Book a Free Trial ── */}
      <section id="book" className="bg-navy-soft py-16 sm:py-20 scroll-mt-24" aria-label={t('home.bookTrialAria')}>
        <Container>
          <SectionDivider tone="dark" className="mb-10 -mt-4" />
          <TrialBookingForm />
        </Container>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Background: Quran with lantern */}
        <Image
          src="/images/hero-home.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary/85" aria-hidden="true" />

        <Container className="relative">
          <SectionDivider tone="dark" className="mb-10 -mt-2" />
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-arabic text-accent text-2xl mb-4" dir="rtl" lang="ar" aria-hidden="true">
              {homeContent.cta.arabicHadith}
            </p>
            <p className="text-white/60 text-sm italic mb-8">
              {homeContent.cta.hadithTranslation}
            </p>
            <h2 id="cta-heading" className="heading-xl font-display text-white mb-4">
              {homeContent.cta.heading}
            </h2>
            <p className="text-white/70 text-lg mb-10">
              {homeContent.cta.subheading}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkButton href={localizedHref('/contact', locale)} size="lg" variant="gold">
                {homeContent.cta.ctaPrimary}
              </LinkButton>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 h-14 px-7 rounded-xl border border-white/30 text-white font-medium hover:border-accent hover:text-accent transition-colors"
              >
                {homeContent.cta.ctaSecondary}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
