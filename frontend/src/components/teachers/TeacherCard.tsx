import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight, Award, Baby } from 'lucide-react'
import type { Teacher } from '@/content/teachers'

export function TeacherCard({ t }: { t: Teacher }) {
  return (
    <Link
      href={`/our-teachers/${t.id}`}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 pt-8 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.05] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      {/* Badges */}
      {t.elite && (
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
          <Award className="size-3" aria-hidden="true" /> Elite
        </span>
      )}
      {t.forChildren && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
          <Baby className="size-3" aria-hidden="true" /> Children
        </span>
      )}

      {/* Avatar */}
      <div className="mx-auto mb-3 mt-2">
        <div className="rounded-full p-[3px] bg-gradient-to-br from-accent/70 to-secondary/70">
          <Image
            src={t.photo}
            alt={t.name}
            width={96}
            height={96}
            className="size-20 rounded-full object-cover ring-2 ring-primary"
          />
        </div>
      </div>

      {/* Rating pill */}
      <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/60 px-3 py-1">
        <span className="flex" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3 ${i < Math.round(t.rating) ? 'fill-accent text-accent' : 'text-white/25'}`}
            />
          ))}
        </span>
        <span className="text-xs font-bold text-white">{t.rating.toFixed(1)}</span>
        <span className="text-[11px] text-white/45">({t.reviewsCount})</span>
      </div>

      {/* Name + subject */}
      <h3 className="text-center font-heading text-lg font-bold text-white">{t.name}</h3>
      <p className="mt-1 truncate text-center text-sm text-emerald-300">{t.title}</p>

      {/* Country */}
      <div className="mx-auto mt-2.5 inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60">
        <MapPin className="size-3" aria-hidden="true" /> {t.country}
      </div>

      {/* Bio */}
      <p className="mt-3 line-clamp-2 text-center text-[13px] leading-relaxed text-white/50">
        {t.bio}
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-white">
          <span className="text-xl font-bold">{t.hourlyRate}</span>
          <span className="text-sm text-white/50"> € /hour</span>
        </p>
        <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-white transition-colors group-hover:bg-accent group-hover:text-primary">
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
