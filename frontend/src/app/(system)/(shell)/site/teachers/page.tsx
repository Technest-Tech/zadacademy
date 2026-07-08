'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus, Star, Pencil, GripVertical } from 'lucide-react'
import { PageHeader } from '@/components/system/primitives/PageHeader'
import { LinkButton } from '@/components/ui/link-button'
import { useSiteTeachers } from '@/hooks/system/useSiteTeachers'

export default function SiteTeachersPage() {
  const { data: teachers, isLoading } = useSiteTeachers()

  return (
    <>
      <PageHeader
        title="Site Teachers"
        description="Manage the teachers, photos, profiles and reviews shown on the public website."
      >
        <LinkButton href="/site/teachers/new">
          <Plus className="size-4" /> Add teacher
        </LinkButton>
      </PageHeader>

      {isLoading ? (
        <p className="text-sm text-muted-text">Loading…</p>
      ) : (
        <div className="grid gap-3">
          {teachers?.map((t) => (
            <Link
              key={t.id}
              href={`/site/teachers/${t.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-border-soft bg-white p-4 transition-colors hover:border-secondary/40"
            >
              <GripVertical className="size-4 shrink-0 text-muted-text/50" aria-hidden="true" />
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-cream">
                {t.image ? (
                  <Image src={t.image} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-semibold text-muted-text">{t.name.charAt(0)}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{t.name}</p>
                  {t.elite && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">Elite</span>}
                  {!t.featured && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-text">Hidden</span>}
                </div>
                <p className="truncate text-sm text-muted-text">{t.title ?? t.role}</p>
              </div>
              <div className="hidden items-center gap-1 text-sm sm:flex">
                <Star className="size-3.5 fill-accent text-accent" />
                {Number(t.rating).toFixed(1)}
                <span className="text-muted-text">· {t.reviews_count} reviews</span>
              </div>
              <div className="text-sm font-medium">{t.hourly_rate} {t.currency}/h</div>
              <Pencil className="size-4 text-muted-text opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
