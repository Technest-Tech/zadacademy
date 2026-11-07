import { Check, Clock, FileText } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { getApproach } from '@/content/approach'
import type { Locale } from '@/i18n/config'

export function ApproachSection({ locale }: { locale: Locale }) {
  const c = getApproach(locale)
  return (
    <section className="bg-cream py-16 sm:py-20" aria-labelledby="approach-heading">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{c.eyebrow}</p>
          <h2 id="approach-heading" className="heading-xl font-heading text-primary text-balance">
            {c.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary/70">{c.intro}</p>
        </div>

        {/* Who we teach */}
        <ul className="mb-10 grid gap-4 md:grid-cols-3" role="list">
          {c.audiences.map((a) => (
            <li key={a.label} className="rounded-2xl border border-border-soft bg-white p-6">
              <p className="mb-2 font-heading text-lg font-semibold text-primary">{a.label}</p>
              <p className="text-sm leading-relaxed text-primary/70">{a.text}</p>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Teaching in French */}
          <div className="rounded-2xl border border-border-soft bg-white p-6 sm:p-8">
            <h3 className="mb-5 font-heading text-xl font-semibold text-primary">{c.pedagogyTitle}</h3>
            <ul className="space-y-3.5" role="list">
              {c.pedagogy.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-primary/75">
                  <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* A 45-minute class */}
          <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
            <h3 className="mb-5 flex items-center gap-2 font-heading text-xl font-semibold">
              <Clock className="size-5 text-accent" aria-hidden="true" />
              {c.sessionTitle}
            </h3>
            <ol className="space-y-3" role="list">
              {c.session.map((s) => (
                <li key={s.activity} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-xl bg-white/5 p-3">
                  <span className="font-semibold text-accent">{s.minutes}</span>
                  <span>
                    <span className="block text-sm font-medium">{s.activity}</span>
                    <span className="block text-xs text-white/60">{s.goal}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Parent report */}
        <div className="mt-6 rounded-2xl border border-accent/40 bg-white p-6 sm:p-8">
          <div className="mb-5 flex items-start gap-3">
            <FileText className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-xl font-semibold text-primary">{c.reportTitle}</h3>
              <p className="mt-1 text-sm text-primary/70">{c.reportIntro}</p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {c.report.map((r) => (
              <li key={r.label} className="rounded-xl bg-cream p-4">
                <p className="text-sm font-semibold text-primary">{r.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-primary/65">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
