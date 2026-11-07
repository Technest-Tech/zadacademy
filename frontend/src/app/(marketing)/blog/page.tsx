import type { Metadata } from 'next'
import { Suspense } from 'react'
import { buildMetadata } from '@/lib/seo'
import { getLocale } from '@/i18n/getLocale'
import { getT } from '@/i18n/getDictionary'
import { breadcrumbSchema } from '@/lib/schema'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { BlogCard } from '@/components/blog/BlogCard'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { blogCategories, blogPosts } from '@/content/blog'
import { blogCategoriesFr } from '@/content/blogFr'
import { publishedPostsFr } from '@/content/blogSchedule'
import { localizedHref } from '@/i18n/href'
import type { Locale } from '@/i18n/config'
import type { BlogPost } from '@/content/blog'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = getT(locale)
  return buildMetadata({
    title: t('meta.blogTitle'),
    description: t('meta.blogDescription'),
    path: '/blog',
    locale,
  })
}

type ApiResponse = {
  data: BlogPost[]
  total: number
  current_page: number
  last_page: number
}

async function getPosts(page: number, category: string, locale: Locale): Promise<ApiResponse> {
  // French articles live in the repo (src/content/blogFr.ts); the CMS posts are English.
  const apiUrl = locale === 'fr' ? undefined : process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const params = new URLSearchParams({ page: String(page), perPage: '9' })
      if (category) params.set('category', category)
      const res = await fetch(`${apiUrl}/api/v1/blog?${params.toString()}`, {
        next: { revalidate: 3600 },
      })
      if (res.ok) return res.json() as Promise<ApiResponse>
    } catch {
      // fall through to static data
    }
  }

  // Static fallback
  const source = locale === 'fr' ? publishedPostsFr() : blogPosts
  const filtered = category
    ? source.filter((p) => p.categories.some((c) => c.slug === category))
    : source
  const perPage = 9
  const total = filtered.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const slice = filtered.slice((page - 1) * perPage, page * perPage)
  return { data: slice, total, current_page: page, last_page: lastPage }
}

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const category = categoryParam ?? ''

  const locale = await getLocale()
  const { data: posts, current_page, last_page } = await getPosts(page, category, locale)
  const featured = posts[0]
  const grid = posts.slice(1)

  const schema = breadcrumbSchema([
    { name: locale === 'fr' ? 'Accueil' : 'Home', href: localizedHref('/', locale) },
    { name: 'Blog', href: localizedHref('/blog', locale) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero strip */}
      <section className="bg-primary pt-40 pb-16 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, #C9A24B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0E7C5A 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Zad Academy
          </p>
          <h1 className="heading-display font-display text-white mb-4">Blog</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Conseils pour apprendre le Coran et l’arabe, guides de Tajwid et ressources pour les familles francophones.'
              : 'Quran learning tips, Tajweed guides, and Islamic education insights from our teachers.'}
          </p>
        </Container>
      </section>

      {/* Featured post */}
      {featured && (
        <Section bg="white">
          <Container>
            <FeaturedPost post={featured} locale={locale} />
          </Container>
        </Section>
      )}

      {/* Category filter + grid */}
      <Section bg="cream">
        <Container>
          <div className="mb-8">
            <Suspense fallback={<div className="h-10" />}>
              <CategoryFilter categories={locale === 'fr' ? blogCategoriesFr : blogCategories} active={category || null} />
            </Suspense>
          </div>

          {grid.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grid.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-muted-text text-center py-12">
              No articles in this category yet.
            </p>
          )}

          <Pagination
            currentPage={current_page}
            totalPages={last_page}
            basePath={localizedHref('/blog', locale)}
            category={category || null}
            locale={locale}
          />
        </Container>
      </Section>
    </>
  )
}
