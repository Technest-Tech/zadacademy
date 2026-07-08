import type {
  Teacher,
  SpecialtyDetail,
  TeacherExperience,
  TeacherCertification,
  RatingBreakdown,
  DaySchedule,
} from './teachers'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001'

type ApiReview = { id: number; author: string; rating: number; text: string }

type ApiTeacher = {
  id: number
  slug: string
  name: string
  name_arabic: string | null
  role: string
  title: string | null
  country: string | null
  bio: string
  image: string | null
  specialties: string[] | null
  languages: string[] | null
  tags: string[] | null
  credentials: string | null
  is_female: boolean
  years_experience: number
  students_count: number
  rating: number
  reviews_count: number
  hourly_rate: number
  currency: string
  elite: boolean
  for_children: boolean
  free_trial: boolean
  courses_given: number
  teaching_hours: number
  quote: string | null
  about: string | null
  teaching_style: string | null
  strengths: string | null
  reviews?: ApiReview[]
}

const SPECIALTY_DESC: Record<string, string> = {
  'Tajweed': 'Mastery of the rules of Tajweed for correct and fluent recitation of the Quran.',
  'Hifz': 'A structured method to memorize the Holy Quran and retain it for life.',
  'Hifz / Memorization': 'A structured method to memorize the Holy Quran and retain it for life.',
  'Ijazah': 'Certification with an authentic, unbroken chain of transmission (sanad).',
  'Ten Qiraat': 'The ten canonical modes of Quranic recitation, taught with precision.',
  'Quran for Kids': 'A playful and caring approach to teaching children the Quran and Arabic.',
  'Noorani Qaida': 'The foundational primer for reading Arabic letters and Quranic script.',
  'Arabic for Non-Arabs': 'Arabic from the alphabet to conversation, built for non-native speakers.',
  'Arabic': 'Arabic from the alphabet to conversation, built for non-native speakers.',
  'Quranic Arabic': 'Understand the language of the Quran — grammar, vocabulary and meaning.',
  'Islamic Studies': 'Introduction to Islamic sciences: fiqh, seerah, aqeedah and Muslim character.',
  'Islamic Studies for Kids': 'Islamic manners and stories, taught in a way children love.',
  'Tafseer': 'Deep study of the meanings and wisdom behind the verses of the Quran.',
  'Seerah': 'The life of the Prophet ﷺ and the lessons it holds for us today.',
  'Aqeedah': 'The foundations of Islamic belief, taught clearly and authentically.',
  'Quran for Adults': 'Start or restart your Quran journey with patience and no judgment.',
  'Revision Techniques': "Proven techniques to review and cement what you've memorized.",
}

const SHARED_AVAILABILITY: DaySchedule[] = [
  { day: 'Sunday', slots: null },
  { day: 'Monday', slots: '09:00–12:00, 16:00–20:00' },
  { day: 'Tuesday', slots: '09:00–12:00, 16:00–20:00' },
  { day: 'Wednesday', slots: '09:00–12:00, 16:00–20:00' },
  { day: 'Thursday', slots: '09:00–12:00, 16:00–20:00' },
  { day: 'Friday', slots: '16:00–20:00' },
  { day: 'Saturday', slots: '09:00–12:00, 16:00–20:00' },
]

function firstName(name: string): string {
  return name.replace(/^(Sheikh|Sister|Dr\.?)\s+/i, '').split(' ')[0]
}

function specialtyDetails(specialties: string[]): SpecialtyDetail[] {
  return specialties.map((s) => ({
    title: s,
    desc: SPECIALTY_DESC[s] ?? 'Taught with care, authenticity and a personalised approach.',
  }))
}

function journey(role: string, primary: string): TeacherExperience[] {
  return [
    {
      role,
      org: 'Zad Academy',
      period: '2023 – Present · Online',
      location: 'Online',
      desc: `Private online ${primary} instruction for students worldwide, children and adults, from beginner to advanced level.`,
    },
    {
      role: 'Quran & Arabic Teacher',
      org: 'Islamic Institute',
      period: '2016 – 2023 · Cairo, Egypt',
      location: 'Cairo, Egypt',
      desc: 'Taught Quran, Tajweed and Arabic to students of all ages, in person and online.',
    },
  ]
}

function certifications(credentials: string): TeacherCertification[] {
  const first = credentials ? credentials.split('.')[0].trim() : 'Quranic Sciences degree'
  const org = credentials ? credentials.split('—')[0].trim() : 'Al-Azhar University'
  return [
    { title: first, org, year: '2016' },
    { title: 'Ijazah in Hafs an ‘Asim (with sanad)', org: 'Certified chain of transmission', year: '2019' },
  ]
}

function ratingBreakdown(rating: number): RatingBreakdown {
  const softer = Math.max(4.5, Math.round((rating - 0.2) * 10) / 10)
  return { reassurance: rating, clarity: softer, progression: softer, preparation: rating }
}

function mapApiTeacher(a: ApiTeacher): Teacher {
  const specialties = a.specialties ?? []
  const first = firstName(a.name)
  return {
    id: a.slug,
    name: a.name,
    nameArabic: a.name_arabic ?? '',
    role: a.role,
    title: a.title ?? a.role,
    specialties,
    languages: a.languages ?? [],
    credentials: a.credentials ?? '',
    bio: a.bio,
    isFemale: a.is_female,
    yearsExperience: a.years_experience,
    studentsCount: a.students_count,
    country: a.country ?? 'Egypt',
    photo: a.image ?? (a.is_female ? '/images/avatar-female-1.png' : '/images/avatar-male-1.png'),
    rating: Number(a.rating),
    reviewsCount: a.reviews_count,
    hourlyRate: a.hourly_rate,
    tags: a.tags ?? [],
    elite: a.elite,
    forChildren: a.for_children,
    freeTrial: a.free_trial,
    coursesGiven: a.courses_given,
    teachingHours: a.teaching_hours,
    quote: a.quote ?? '',
    about: a.about ?? a.bio,
    teachingStyle:
      a.teaching_style ??
      'A warm, interactive approach that emphasises practice and active learning, tailored to your level and goals.',
    strengths:
      a.strengths ??
      `${(a.tags ?? []).slice(0, 3).join(', ')}. ${first} adapts every session to the student.`,
    specialtyDetails: specialtyDetails(specialties),
    journey: journey(a.role, specialties[0] ?? 'Quran'),
    certifications: certifications(a.credentials ?? ''),
    ratingBreakdown: ratingBreakdown(Number(a.rating)),
    reviews: (a.reviews ?? []).map((r) => ({
      id: String(r.id),
      author: r.author,
      rating: r.rating,
      text: r.text,
    })),
    availability: SHARED_AVAILABILITY,
  }
}

export async function fetchTeachers(): Promise<Teacher[]> {
  try {
    const res = await fetch(`${API}/api/v1/teachers`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data as ApiTeacher[]).map(mapApiTeacher)
  } catch {
    return []
  }
}

export async function fetchTeacher(slug: string): Promise<Teacher | null> {
  try {
    const res = await fetch(`${API}/api/v1/teachers/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return mapApiTeacher(json.data as ApiTeacher)
  } catch {
    return null
  }
}
