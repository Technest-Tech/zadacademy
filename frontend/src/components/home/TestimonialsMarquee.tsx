import Link from 'next/link'
import { Star, Sparkles, ArrowRight } from 'lucide-react'
import { SectionDivider } from '@/components/layout/SectionDivider'
import type { Testimonial } from '@/content/testimonials'

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm select-none transition-colors hover:border-accent/40 hover:bg-white/[0.06]">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-accent text-accent" aria-hidden="true" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-white/70 text-[13.5px] leading-relaxed mb-4 line-clamp-5">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <footer className="flex items-center gap-3">
        <div
          className="size-9 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-semibold text-xs shrink-0"
          aria-hidden="true"
        >
          {t.name.replace(/[^A-Za-z ]/g, '').split(' ').map((w) => w.charAt(0)).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm leading-none mb-1 truncate">{t.name}</p>
          <p className="text-white/40 text-xs truncate">{t.location}</p>
        </div>
      </footer>
    </div>
  )
}

/** A vertically scrolling column (content duplicated for a seamless loop). */
function Column({
  items,
  direction,
}: {
  items: Testimonial[]
  direction: 'up' | 'down'
}) {
  const anim = direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'
  return (
    <div className="group relative h-[560px] overflow-hidden">
      {/* Top & bottom fade masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-primary to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-primary to-transparent" aria-hidden="true" />

      <div className={`flex flex-col gap-4 ${anim} group-hover:[animation-play-state:paused]`}>
        {[...items, ...items].map((t, i) => (
          <Card key={`${direction}-${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsMarquee({ items }: { items: Testimonial[] }) {
  const third = Math.ceil(items.length / 3)
  const colLeft = items.slice(0, third * 2)
  const colRight = items.slice(third)

  const stats = [
    { value: '4.9', label: 'Average Rating' },
    { value: '10,000+', label: 'Happy Students' },
    { value: '2,000+', label: 'Verified Reviews' },
  ]

  return (
    <section
      className="relative overflow-hidden bg-primary py-20 md:py-24"
      aria-labelledby="testimonials-heading"
    >
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testi-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#F8F4ED" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testi-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionDivider tone="dark" className="mb-12 -mt-4" />
        <div className="grid items-center gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Left column — scrolls up (hidden on mobile) */}
          <div className="hidden lg:block">
            <Column items={colLeft} direction="up" />
          </div>

          {/* Center — header, stats, CTA */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-xl bg-accent/15">
              <Sparkles className="size-6 text-accent" aria-hidden="true" />
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Testimonials
            </p>

            <h2 id="testimonials-heading" className="heading-xl font-heading text-white">
              What Our
              <br />
              <span className="text-accent">Students Say</span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
              Thousands of families around the world trust us to teach their
              children the Quran and Arabic — with patience, care, and Ijazah.
            </p>

            {/* Stats row */}
            <dl className="mx-auto mt-9 flex max-w-md items-stretch justify-center divide-x divide-white/10">
              {stats.map((s) => (
                <div key={s.label} className="flex-1 px-4">
                  <dt className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-tight text-white/45">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTA */}
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-accent/50 px-7 py-3.5 font-medium text-accent transition-colors hover:bg-accent hover:text-primary"
            >
              Join Our Students
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right column — scrolls down (hidden on mobile) */}
          <div className="hidden lg:block">
            <Column items={colRight} direction="down" />
          </div>
        </div>

        {/* Mobile — single scrolling column */}
        <div className="mt-10 lg:hidden">
          <Column items={colLeft} direction="up" />
        </div>
      </div>
    </section>
  )
}
