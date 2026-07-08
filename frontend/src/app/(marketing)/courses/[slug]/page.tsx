import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata } from '@/lib/seo'
import { courseSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { whatsappLink } from '@/config/site'
import { courses } from '@/content/courses'
import { courseImage } from '@/content/courseImages'
import { teachers, featuredTeachers } from '@/content/teachers'
import { StickyCourseCta } from '@/components/courses/StickyCourseCta'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Star,
  ChevronDown,
  Users,
  Clock,
  ClipboardList,
  MessageCircle,
  Sparkles,
  GraduationCap,
} from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = courses.find((c) => c.slug === slug)
  if (!course) return {}
  return buildMetadata({
    title: course.seoTitle,
    description: course.seoDescription,
    path: `/courses/${slug}`,
  })
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

const REQUIREMENTS: Record<string, string> = {
  'Beginner': 'None — start from scratch',
  'All Levels': 'None — all levels welcome',
  'Intermediate': 'Basic Quran reading',
  'Advanced': 'Strong Tajweed & fluency',
}

/* ── Building blocks ── */

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 font-heading text-2xl font-bold text-white">{children}</h2>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = courses.find((c) => c.slug === slug)
  if (!course) notFound()

  const courseTeachers = (() => {
    const filtered = teachers.filter((t) =>
      t.specialties.some((s) => course.specialtyTags.includes(s)),
    )
    return filtered.length > 0 ? filtered.slice(0, 3) : featuredTeachers.slice(0, 3)
  })()

  const relatedCourses = course.relatedSlugs
    .map((s) => courses.find((c) => c.slug === s))
    .filter(Boolean) as typeof courses

  const otherCourses =
    relatedCourses.length >= 3
      ? relatedCourses.slice(0, 4)
      : courses.filter((c) => c.slug !== course.slug).slice(0, 4)

  const tags = [...course.specialtyTags, ...(course.ageGroup ? [course.ageGroup] : [])].slice(0, 4)
  const levelActive = course.level === 'All Levels' ? LEVELS : [course.level]

  const characteristics = [
    { icon: Star, label: 'Rating', value: '4.9 / 5' },
    { icon: Users, label: 'Course type', value: 'Individual (1-on-1)' },
    { icon: Clock, label: 'Length', value: course.durationMonths ? `~${course.durationMonths} months` : 'approx. 24 hours / level' },
    { icon: ClipboardList, label: 'Requirements', value: REQUIREMENTS[course.level] ?? 'None' },
  ]

  const schemas = [
    courseSchema(course),
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Courses', href: '/courses' },
      { name: course.title, href: `/courses/${course.slug}` },
    ]),
    faqSchema(course.faqs),
  ]

  const waHref = whatsappLink(`Assalamu alaikum, I'm interested in the ${course.title} course.`)

  return (
    <div className="bg-primary">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 lg:pt-32" aria-labelledby="course-heading">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 85% 0%, rgba(14,124,90,0.28), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to classes
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_460px]">
            <div>
              <h1 id="course-heading" className="heading-display font-heading font-bold text-white text-balance">
                {course.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                {course.longDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/75">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course image */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <Image
                src={courseImage(course.slug)}
                alt={course.title}
                width={920}
                height={598}
                priority
                sizes="(max-width: 1024px) 100vw, 460px"
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Body ═══ */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ── Main ── */}
          <div className="space-y-6">
            {/* Perks strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-accent/20 bg-accent/[0.06] px-6 py-4 text-sm font-medium text-accent">
              {['Flexible hours', 'Used by thousands', '1-on-1 lessons', 'Certificate on completion'].map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-3.5" aria-hidden="true" /> {p}
                </span>
              ))}
            </div>

            {/* About */}
            <Panel>
              <PanelTitle>About this course</PanelTitle>
              <p className="leading-relaxed text-white/70">{course.longDescription}</p>
              <p className="mt-4 leading-relaxed text-white/70">{course.shortDescription}</p>

              {/* Levels */}
              <div className="mt-6 flex flex-wrap gap-2">
                {LEVELS.map((lvl) => {
                  const active = (levelActive as readonly string[]).includes(lvl)
                  return (
                    <span
                      key={lvl}
                      className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${
                        active
                          ? 'border-accent/50 bg-accent/15 text-accent'
                          : 'border-white/10 text-white/35'
                      }`}
                    >
                      {lvl}
                    </span>
                  )
                })}
              </div>
            </Panel>

            {/* What you'll learn */}
            <Panel>
              <PanelTitle>What you will learn</PanelTitle>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span className="text-sm leading-snug text-white/75">{o}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Course program (curriculum) */}
            <Panel>
              <PanelTitle>Course program</PanelTitle>
              <div className="space-y-3">
                {course.curriculum.map((item, i) => (
                  <details key={item.module} className="group rounded-xl border border-white/10 bg-white/[0.02] [&_summary]:list-none" open={i === 0}>
                    <summary className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-emerald-300" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="flex-1 font-semibold text-white">{item.module}</span>
                      <ChevronDown className="size-4 text-white/40 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ul className="space-y-2 px-4 pb-4 pl-14">
                      {item.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm text-white/60">
                          <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </Panel>

            {/* Who this is for */}
            <Panel>
              <PanelTitle>Who this course is for</PanelTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {course.personas.map((p) => (
                  <div key={p.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h3 className="mb-1.5 font-semibold text-white">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-white/55">{p.description}</p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Your teachers */}
            <Panel>
              <PanelTitle>Your teachers</PanelTitle>
              <ul className="grid gap-4 sm:grid-cols-3">
                {courseTeachers.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/our-teachers/${t.id}`}
                      className="group flex h-full flex-col items-center rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center transition-colors hover:border-accent/40"
                    >
                      <Image
                        src={t.photo}
                        alt={t.name}
                        width={64}
                        height={64}
                        className="mb-3 size-14 rounded-full object-cover ring-2 ring-accent/40"
                      />
                      <p className="font-semibold text-white group-hover:text-accent">{t.name}</p>
                      <p className="mt-0.5 text-xs text-emerald-300">{t.role}</p>
                      <p className="mt-2 text-xs text-white/40">{t.yearsExperience} yrs · {t.studentsCount}+ students</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* FAQ */}
            <Panel>
              <PanelTitle>Frequently asked questions</PanelTitle>
              <div className="space-y-3">
                {course.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-white/10 bg-white/[0.02] [&_summary]:list-none">
                    <summary className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                      <span className="flex-1 font-semibold text-white">{faq.q}</span>
                      <ChevronDown className="size-4 shrink-0 text-white/40 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-white/60">{faq.a}</p>
                  </details>
                ))}
              </div>
            </Panel>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Start now */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-[#0a6849] p-6 shadow-lg">
              <h3 className="font-heading text-xl font-bold text-white">Start now!</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Book your free trial lesson and discover our teaching method.
              </p>

              <ul className="my-5 space-y-2.5 border-y border-white/15 py-4">
                {characteristics.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5 text-sm text-white/90">
                    <c.icon className="size-4 shrink-0 text-white/70" aria-hidden="true" />
                    <span className="text-white/70">{c.label}:</span>
                    <span className="ml-auto font-medium text-white">{c.value}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-semibold text-secondary transition-transform hover:scale-[1.02]"
              >
                Book your free trial <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-center text-xs text-white/70">
                ✓ Free first class · No credit card required
              </p>
            </div>

            {/* Other courses */}
            <Panel className="p-5 sm:p-6">
              <h3 className="mb-4 font-heading text-lg font-bold text-white">Other courses</h3>
              <ul className="divide-y divide-white/10">
                {otherCourses.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="group flex items-center gap-2 py-3 text-sm text-white/75 transition-colors hover:text-accent"
                    >
                      <GraduationCap className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      <span className="flex-1">{c.title}</span>
                      <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Any questions */}
            <Panel className="p-5 sm:p-6">
              <h3 className="mb-2 font-heading text-lg font-bold text-white">Any questions?</h3>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                Our team is available to answer all your questions.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="size-5" aria-hidden="true" /> WhatsApp
              </a>
            </Panel>
          </aside>
        </div>
      </div>

      {/* Spacer so the mobile sticky bar doesn't overlap content */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <StickyCourseCta courseTitle={course.title} />
    </div>
  )
}
