import Link from 'next/link'
import { Fragment } from 'react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { localizedHref } from '@/i18n/href'
import type { Locale } from '@/i18n/config'
import { PLACEHOLDER, type LegalBlock, type LegalDoc } from '@/content/legal'

const TOKEN = new RegExp(
  `(\\[[^\\]]+\\]\\([^)]+\\)|${[PLACEHOLDER.fr, PLACEHOLDER.en]
    .map((p) => p.replace(/[[\]]/g, '\\$&'))
    .join('|')})`,
  'g',
)

/**
 * Render a legal sentence: `[label](href)` becomes a link (internal paths get
 * the locale prefix), and a missing-detail placeholder is highlighted so it
 * cannot slip through to production unnoticed.
 */
function Rich({ text, locale }: { text: string; locale: Locale }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const [, label, href] = link
          return href.startsWith('/') ? (
            <Link key={i} href={localizedHref(href, locale)} className="text-secondary font-medium underline underline-offset-2">
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-secondary font-medium underline underline-offset-2">
              {label}
            </a>
          )
        }
        if (part === PLACEHOLDER.fr || part === PLACEHOLDER.en) {
          return (
            <mark key={i} className="rounded bg-amber-200 px-1 text-amber-950">
              {part}
            </mark>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  if (typeof block === 'string') {
    return (
      <p>
        <Rich text={block} locale={locale} />
      </p>
    )
  }
  if ('list' in block) {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-accent">
        {block.list.map((item, i) => (
          <li key={i}>
            <Rich text={item} locale={locale} />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border-soft bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary/5 text-primary">
          <tr>
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {block.table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  <Rich text={cell} locale={locale} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function LegalPage({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  return (
    <>
      <section className="relative bg-primary overflow-hidden pt-40 pb-16" aria-labelledby="legal-heading">
        <Container className="relative text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">{doc.eyebrow}</p>
          <h1 id="legal-heading" className="heading-display font-display text-white text-balance mb-4 max-w-3xl mx-auto">
            {doc.title}
          </h1>
          <p className="text-white/60 text-sm">{doc.updated}</p>
        </Container>
      </section>

      <Section bg="cream">
        <Container>
          <article className="mx-auto max-w-3xl space-y-10 text-[15px] leading-relaxed text-primary/80">
            {doc.intro && (
              <p className="text-lg text-primary">
                <Rich text={doc.intro} locale={locale} />
              </p>
            )}
            {doc.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="font-display text-2xl text-primary">{section.heading}</h2>
                {section.body.map((block, i) => (
                  <Block key={i} block={block} locale={locale} />
                ))}
              </section>
            ))}
          </article>
        </Container>
      </Section>
    </>
  )
}
