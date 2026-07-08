import { Award } from 'lucide-react'
import { TeacherCard } from '@/components/teachers/TeacherCard'
import { SectionDivider } from '@/components/layout/SectionDivider'
import { fetchTeachers } from '@/content/teachersApi'

export async function TeachersSection() {
  const teachers = await fetchTeachers()
  if (teachers.length === 0) return null

  return (
    <section id="teachers" className="relative overflow-hidden bg-navy-deep py-20 md:py-24 scroll-mt-24">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="teachers-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#F8F4ED" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#teachers-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionDivider tone="dark" className="mb-12 -mt-4" />
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Award className="size-3.5" aria-hidden="true" /> Al-Azhar Graduates
          </span>
          <h2 id="teachers-heading" className="heading-xl font-heading text-white">
            Our Expert{' '}
            <span
              className="text-accent"
              style={{ textShadow: '0 0 30px rgba(201,162,75,0.5)' }}
            >
              Teachers
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
            Al-Azhar graduate teachers, dedicated to your success — each chosen for
            their excellence and teaching skill.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((t) => (
            <TeacherCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
