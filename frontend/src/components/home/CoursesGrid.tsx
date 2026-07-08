import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/ui/link-button'
import { SectionDivider } from '@/components/layout/SectionDivider'
import { courseImage } from '@/content/courseImages'
import type { Course } from '@/content/courses'

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={courseImage(course.slug)}
          alt={course.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom scrim for tag legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />

        {/* Gold corner triangle */}
        <span
          className="absolute right-0 top-0 border-l-[38px] border-t-[38px] border-l-transparent border-t-accent"
          aria-hidden="true"
        />

        {/* Tag pills */}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {course.specialtyTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-white/55">
          {course.shortDescription}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
          Discover
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export function CoursesGrid({ courses }: { courses: Course[] }) {
  const featured = courses.slice(0, 8)

  return (
    <section
      className="relative overflow-hidden py-20 md:py-24"
      aria-labelledby="courses-heading"
    >
      {/* Background image */}
      <Image
        src="/images/why-alrayan-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      {/* Dark overlay to deepen the pattern and lift the cards */}
      <div className="absolute inset-0 bg-primary/88" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(14,124,90,0.18), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionDivider tone="dark" className="mb-12 -mt-4" />
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 id="courses-heading" className="heading-xl font-heading font-bold text-white">
            Our Most Popular{' '}
            <span className="text-emerald-300">Courses</span>
          </h2>
          <p className="mt-4 text-base text-white/60">
            Programs adapted to all levels and all ages.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <LinkButton href="/courses" variant="gold" size="lg">
            View All Courses
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
