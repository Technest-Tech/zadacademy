import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata } from '@/lib/seo'
import { personSchema, breadcrumbSchema } from '@/lib/schema'
import { whatsappLink } from '@/config/site'
import { fetchTeachers, fetchTeacher } from '@/content/teachersApi'
import { TeacherCard } from '@/components/teachers/TeacherCard'
import { ReviewForm } from '@/components/teachers/ReviewForm'
import {
  BookOpen,
  Clock,
  Star,
  MapPin,
  Globe,
  Check,
  CheckCircle2,
  Award,
  Briefcase,
  CalendarDays,
  MessageCircle,
  Baby,
  Quote,
} from 'lucide-react'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const teachers = await fetchTeachers()
  return teachers.map((t) => ({ id: t.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const t = await fetchTeacher(id)
  if (!t) return {}
  return buildMetadata({
    title: `${t.name} — ${t.role} | Zad Academy`,
    description: t.bio,
    path: `/our-teachers/${id}`,
  })
}

/* ── Small building blocks ── */

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 ${className}`}>
      {children}
    </div>
  )
}

function PanelTitle({ icon: Icon, children }: { icon?: typeof Star; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-white">
      {Icon && <Icon className="size-5 text-emerald-400" aria-hidden="true" />}
      {children}
    </h2>
  )
}

function Stars({ rating, className = 'size-4' }: { rating: number; className?: string }) {
  return (
    <span className="flex" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(rating) ? 'fill-accent text-accent' : 'text-white/25'}`} aria-hidden="true" />
      ))}
    </span>
  )
}

export default async function TeacherPage({ params }: Props) {
  const { id } = await params
  const t = await fetchTeacher(id)
  if (!t) notFound()

  const similar = (await fetchTeachers()).filter((x) => x.id !== id).slice(0, 6)
  const bookMsg = `Assalamu alaikum, I would like to book a class with ${t.name}.`

  const whyChooseMe = [
    t.forChildren && 'Suitable for children',
    t.freeTrial && 'Free trial lesson offered',
    'Ijazah-certified teacher',
    'One-on-one online lessons',
  ].filter(Boolean) as string[]

  const breakdown = [
    { label: 'Reassurance', value: t.ratingBreakdown.reassurance },
    { label: 'Clarity', value: t.ratingBreakdown.clarity },
    { label: 'Progression', value: t.ratingBreakdown.progression },
    { label: 'Preparation', value: t.ratingBreakdown.preparation },
  ]

  return (
    <div className="bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(t)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', href: '/' },
              { name: 'Teachers', href: '/#teachers' },
              { name: t.name, href: `/our-teachers/${t.id}` },
            ]),
          ),
        }}
      />

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 lg:pt-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 80% 0%, rgba(14,124,90,0.25), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">
            {/* Photo */}
            <div className="relative mx-auto w-full max-w-xs">
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={480}
                  height={560}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
                {t.forChildren && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                    <Baby className="size-3.5" aria-hidden="true" /> Perfect for children
                  </span>
                )}
              </div>
              {/* Gold corner accents */}
              <span className="pointer-events-none absolute -left-1.5 -top-1.5 size-6 rounded-tl-lg border-l-2 border-t-2 border-accent/70" aria-hidden="true" />
              <span className="pointer-events-none absolute -right-1.5 -top-1.5 size-6 rounded-tr-lg border-r-2 border-t-2 border-accent/70" aria-hidden="true" />
              <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 size-6 rounded-bl-lg border-b-2 border-l-2 border-accent/70" aria-hidden="true" />
              <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 size-6 rounded-br-lg border-b-2 border-r-2 border-accent/70" aria-hidden="true" />
            </div>

            {/* Intro */}
            <div>
              <h1 className="heading-xl font-heading font-bold text-white">{t.name}</h1>
              <p className="mt-2 text-lg text-emerald-300">{t.role}</p>
              <p className="mt-2 flex items-center gap-1.5 text-white/60">
                <MapPin className="size-4" aria-hidden="true" /> {t.country}
              </p>

              <p className="mt-5 flex items-start gap-2 text-lg italic text-white/80">
                <Quote className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                {t.quote}
              </p>

              {/* Stats */}
              <div className="mt-7 grid max-w-2xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] py-5">
                <div className="px-4 text-center">
                  <BookOpen className="mx-auto mb-2 size-5 text-emerald-400" aria-hidden="true" />
                  <div className="font-display text-2xl font-bold text-white">{t.coursesGiven}</div>
                  <div className="mt-0.5 text-xs text-white/45">courses given</div>
                </div>
                <div className="px-4 text-center">
                  <Clock className="mx-auto mb-2 size-5 text-emerald-400" aria-hidden="true" />
                  <div className="font-display text-2xl font-bold text-white">{t.teachingHours.toLocaleString()}</div>
                  <div className="mt-0.5 text-xs text-white/45">hours taught</div>
                </div>
                <div className="px-4 text-center">
                  <Star className="mx-auto mb-2 size-5 text-emerald-400" aria-hidden="true" />
                  <div className="font-display text-2xl font-bold text-white">{t.rating.toFixed(1)}<span className="text-base text-white/50"> /5</span></div>
                  <div className="mt-0.5 text-xs text-white/45">{t.reviewsCount} reviews</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/75">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-6">
                <p className="mb-2 flex items-center gap-1.5 text-sm text-white/60">
                  <Globe className="size-4" aria-hidden="true" /> I speak
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.languages.map((lang, i) => (
                    <span key={lang} className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm text-white">
                      {lang}
                      <span className="ml-1.5 text-xs text-white/40">{i === 0 ? '· Native' : '· Fluent'}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3">
                  <p className="text-white">
                    <span className="text-3xl font-bold">€{t.hourlyRate}</span>
                    <span className="text-white/50"> /hour</span>
                  </p>
                  {t.freeTrial && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1.5 text-sm font-medium text-emerald-300">
                      <Check className="size-4" aria-hidden="true" /> Free Trial
                    </span>
                  )}
                </div>
                <a
                  href={whatsappLink(bookMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-7 py-3.5 font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
                >
                  <MessageCircle className="size-5" aria-hidden="true" /> Book a course
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Body ═══ */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ── Main column ── */}
          <div className="space-y-6">
            {/* About */}
            <Panel>
              <PanelTitle>About me</PanelTitle>
              <p className="leading-relaxed text-white/70">{t.about}</p>
            </Panel>

            {/* Journey */}
            <Panel>
              <PanelTitle>My journey</PanelTitle>

              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
                <Briefcase className="size-4" aria-hidden="true" /> Professional experience
              </h3>
              <ol className="mb-7 space-y-5 border-l border-white/10 pl-5">
                {t.journey.map((j, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[23px] top-1.5 size-2.5 rounded-full bg-accent" aria-hidden="true" />
                    <p className="font-semibold text-white">{j.role}</p>
                    <p className="text-sm text-emerald-300">{j.org}</p>
                    <p className="text-xs text-white/40">{j.period}</p>
                    <p className="mt-1.5 text-sm text-white/60">{j.desc}</p>
                  </li>
                ))}
              </ol>

              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
                <Award className="size-4" aria-hidden="true" /> Certifications &amp; diplomas
              </h3>
              <ul className="space-y-2.5">
                {t.certifications.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span className="text-sm text-white/75">
                      <span className="font-medium text-white">{c.title}</span> — {c.org}{' '}
                      <span className="text-white/40">({c.year})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Teaching style */}
            <Panel>
              <PanelTitle>My teaching style</PanelTitle>
              <p className="leading-relaxed text-white/70">{t.teachingStyle}</p>
            </Panel>

            {/* Strengths */}
            <Panel>
              <PanelTitle>My strengths</PanelTitle>
              <p className="leading-relaxed text-white/70">{t.strengths}</p>
            </Panel>

            {/* Specialties */}
            <Panel>
              <PanelTitle>My specialties</PanelTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {t.specialtyDetails.map((s) => (
                  <div key={s.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="mb-1.5 font-semibold text-white">{s.title}</h4>
                    <p className="text-sm leading-relaxed text-white/55">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Reviews */}
            <Panel>
              <div className="mb-5 flex items-center justify-between">
                <PanelTitle>What my students say</PanelTitle>
                <span className="text-sm text-white/45">{t.reviews.length} reviews</span>
              </div>

              {/* Breakdown */}
              <div className="mb-7 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-4">
                {breakdown.map((b) => (
                  <div key={b.label} className="text-center">
                    <div className="font-display text-2xl font-bold text-emerald-400">{b.value.toFixed(1)}</div>
                    <div className="mt-1 text-xs text-white/50">{b.label}</div>
                  </div>
                ))}
              </div>

              {/* Review list */}
              <ul className="space-y-3">
                {t.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-sm font-semibold text-white" aria-hidden="true">
                        {r.author.charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{r.author}</span>
                        <Stars rating={r.rating} className="size-3.5" />
                      </div>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/65">{r.text}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Leave a review */}
            <Panel>
              <PanelTitle>Leave a review</PanelTitle>
              <ReviewForm teacherName={t.name} />
            </Panel>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Availability */}
            <Panel className="p-5 sm:p-6">
              <PanelTitle icon={CalendarDays}>Availability</PanelTitle>
              <ul className="space-y-1">
                {t.availability.map((d) => (
                  <li
                    key={d.day}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm odd:bg-white/[0.02]"
                  >
                    <span className={d.slots ? 'font-medium text-emerald-300' : 'text-white/40'}>{d.day}</span>
                    <span className={d.slots ? 'text-emerald-200/80' : 'text-white/30'}>
                      {d.slots ?? 'Unavailable'}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(bookMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 font-semibold text-white transition-colors hover:bg-[#0a6849]"
              >
                <MessageCircle className="size-5" aria-hidden="true" /> Book now
              </a>
            </Panel>

            {/* Why choose me */}
            <Panel className="p-5 sm:p-6">
              <h3 className="mb-4 font-heading text-lg font-bold text-white">Why choose me?</h3>
              <ul className="space-y-3">
                {whyChooseMe.map((w) => (
                  <li key={w} className="flex items-center gap-2.5 text-sm text-white/75">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                      <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </Panel>
          </aside>
        </div>

        {/* ═══ Similar teachers ═══ */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-white">Similar teachers</h2>
            <Link href="/#teachers" className="text-sm font-medium text-emerald-300 hover:text-accent">
              View all →
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
            {similar.map((s) => (
              <div key={s.id} className="w-[270px] shrink-0">
                <TeacherCard t={s} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
