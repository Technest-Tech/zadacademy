'use client'

import { useState } from 'react'
import { Star, CheckCircle2 } from 'lucide-react'
import { useT } from '@/i18n/MarketingI18nProvider'

export function ReviewForm({ teacherName }: { teacherName: string }) {
  const { t } = useT()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 px-6 py-10 text-center">
        <CheckCircle2 className="size-10 text-emerald-400" aria-hidden="true" />
        <h4 className="font-heading text-lg font-bold text-white">{t('reviewForm.thanksTitle')}</h4>
        <p className="max-w-sm text-sm text-white/60">
          {t('reviewForm.thanksBody')}
        </p>
      </div>
    )
  }

  const active = hover || rating

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (rating === 0 || !name.trim()) return
        setSubmitted(true)
      }}
      className="space-y-5"
    >
      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm text-white/70">{t('reviewForm.ratingLabel')}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={n > 1 ? t('reviewForm.starsAria', { n }) : t('reviewForm.starAria', { n })}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star className={`size-7 ${n <= active ? 'fill-accent text-accent' : 'text-white/25'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="rv-name" className="mb-2 block text-sm text-white/70">{t('reviewForm.authorLabel')}</label>
        <input
          id="rv-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('reviewForm.authorPlaceholder')}
          className="w-full rounded-xl border border-white/15 bg-primary/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-accent/60"
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="rv-comment" className="mb-2 block text-sm text-white/70">{t('reviewForm.textLabel')}</label>
        <textarea
          id="rv-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder={t('reviewForm.textPlaceholder', { name: teacherName })}
          className="w-full resize-none rounded-xl border border-white/15 bg-primary/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-accent/60"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || !name.trim()}
        className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0a6849] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('reviewForm.submit')}
      </button>
    </form>
  )
}
