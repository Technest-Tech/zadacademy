import { Clock, FileText, Languages } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { getApproach } from '@/content/approach'
import type { Locale } from '@/i18n/config'

const ICONS = { Languages, Clock, FileText }

export function ApproachSection({ locale }: { locale: Locale }) {
  const c = getApproach(locale)
  return (
    <section className="bg-cream py-12 sm:py-14" aria-labelledby="approach-heading">
      <Container>
        <h2
          id="approach-heading"
          className="mx-auto mb-8 max-w-2xl text-center font-heading text-2xl font-semibold text-primary text-balance sm:text-3xl"
        >
          {c.heading}
        </h2>
        <ul className="grid gap-4 md:grid-cols-3" role="list">
          {c.points.map((p) => {
            const Icon = ICONS[p.icon]
            return (
              <li key={p.title} className="flex gap-4 rounded-2xl border border-border-soft bg-white p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <Icon className="size-5 text-secondary" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-base font-semibold text-primary">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-primary/70">{p.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
