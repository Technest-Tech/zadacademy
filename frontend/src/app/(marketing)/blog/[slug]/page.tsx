import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'
import { localizedHref } from '@/i18n/href'
import { breadcrumbSchema, blogPostingSchema } from '@/lib/schema'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { LinkButton } from '@/components/ui/link-button'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { SocialShare } from '@/components/blog/SocialShare'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { BlogCover } from '@/components/blog/BlogCover'
import { blogPosts } from '@/content/blog'
import { publishedPostsFr, unlinkUnpublished } from '@/content/blogSchedule'
import { localeTag, type Locale } from '@/i18n/config'
import { siteConfig, whatsappLink } from '@/config/site'
import type { BlogPost } from '@/content/blog'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

async function getPost(slug: string, locale: Locale): Promise<BlogPost | null> {
  // French articles are in the repo; the CMS serves the English ones.
  if (locale === 'fr') return publishedPostsFr().find((p) => p.slug === slug) ?? null
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/api/v1/blog/${slug}`, {
        next: { revalidate: 3600 },
      })
      if (res.ok) return res.json()
    } catch {
      // fall through to static data
    }
  }
  return blogPosts.find((p) => p.slug === slug) ?? null
}

export function generateStaticParams() {
  // Scheduled French articles are left out and rendered on demand once live.
  return [...blogPosts, ...publishedPostsFr()].map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const post = await getPost(slug, locale)
  if (!post) return {}
  return buildMetadata({
    singleLocale: true,
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt,
    path: `/blog/${slug}`,
    type: 'article',
    locale,
    ...(post.cover_image?.startsWith('/') && {
      image: `${siteConfig.url}${post.cover_image}`,
      imageSize: { width: 1200, height: 675 },
    }),
  })
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function addHeadingIds(html: string): string {
  return html.replace(/<(h[23])[^>]*>(.*?)<\/h[23]>/gi, (_, tag, content) => {
    const id = content
      .replace(/<[^>]+>/g, '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return `<${tag} id="${id}">${content}</${tag}>`
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const fr = locale === 'fr'
  const t = getT(locale)
  const post = await getPost(slug, locale)
  if (!post) notFound()

  const relatedPosts = (locale === 'fr' ? publishedPostsFr() : blogPosts)
    .filter((p) => p.slug !== post.slug)
    .filter((p) =>
      p.categories.some((c) =>
        post.categories.map((pc) => pc.slug).includes(c.slug),
      ),
    )
    .slice(0, 3)

  const bodyWithIds = addHeadingIds(locale === 'fr' ? unlinkUnpublished(post.body) : post.body)
  const postUrl = `${siteConfig.url}${localizedHref(`/blog/${post.slug}`, locale)}`

  const schemas = [
    blogPostingSchema(post),
    breadcrumbSchema([
      { name: t('nav.home'), href: localizedHref('/', locale) },
      { name: 'Blog', href: localizedHref('/blog', locale) },
      { name: post.title, href: localizedHref(`/blog/${post.slug}`, locale) },
    ]),
  ]

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      {/* Hero */}
      <section className="bg-primary pt-40 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, #C9A24B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0E7C5A 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6" aria-label={t('countryPage.breadcrumb')}>
            <Link href={localizedHref('/', locale)} className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <Link href={localizedHref('/blog', locale)} className="hover:text-white transition-colors">{t('nav.blog')}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/40 line-clamp-1">{post.title}</span>
          </nav>

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((c) => (
                <span
                  key={c.slug}
                  className="bg-secondary/20 text-accent text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wide"
                >
                  {c.title}
                </span>
              ))}
            </div>
          )}

          <h1 className="heading-display font-display text-white mb-6">{post.title}</h1>

          {/* Byline */}
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
            <span>{post.author.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at}>{formatDate(post.published_at, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{t('blogUi.minRead', { n: post.reading_minutes })}</span>
          </div>
        </Container>
      </section>

      {/* Article body + ToC */}
      <Section bg="white">
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 max-w-5xl mx-auto">
            {/* Article */}
            <article>
              {post.cover_image?.startsWith('/') && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-primary/10">
                  <BlogCover src={post.cover_image} priority sizes="(min-width: 1024px) 760px, 100vw" />
                </div>
              )}
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-foreground prose-p:text-foreground prose-strong:text-primary"
                dangerouslySetInnerHTML={{ __html: bodyWithIds }}
              />

              <SocialShare title={post.title} url={postUrl} />

              {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} locale={locale} />}
            </article>

            {/* Table of Contents — sticky sidebar */}
            <aside className="hidden lg:block">
              <TableOfContents html={post.body} />
            </aside>
          </div>
        </Container>
      </Section>

      {/* CTA Banner */}
      <Section bg="primary">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
              {fr ? 'Commencer' : 'Start Learning'}
            </p>
            <h2 className="heading-xl font-display text-white mb-4">
              {fr ? 'Prêt à commencer votre parcours ?' : 'Ready to Begin Your Quran Journey?'}
            </h2>
            <p className="text-white/70 text-lg mb-10">
              {fr
                ? 'Réservez un premier cours offert avec un enseignant dédié, sans paiement ni engagement.'
                : 'Book a free first class with a dedicated teacher — no payment, no commitment.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkButton href={localizedHref('/contact', locale)} size="lg" variant="gold">
                {fr ? 'Réserver mon cours d’essai' : 'Book Free Trial'}
              </LinkButton>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 h-14 px-7 rounded-xl border border-white/30 text-white font-medium hover:border-accent hover:text-accent transition-colors"
              >
                {fr ? 'Écrire sur WhatsApp' : 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
