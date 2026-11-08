import type { Locale } from '@/i18n/config'

/**
 * Specialty tags (course `specialtyTags`, teacher `specialties`) are stored in
 * English because they are matching keys: a course page lists the teachers whose
 * specialties overlap its tags. Translate them only when displaying.
 */
const SPECIALTY_LABELS_FR: Record<string, string> = {
  'Tajweed': 'Tajwid',
  'Hifz': 'Mémorisation',
  'Hifz / Memorization': 'Mémorisation du Coran',
  'Ijazah': 'Ijaza',
  'Ten Qiraat': 'Les dix lectures',
  'Quran for Kids': 'Coran pour enfants',
  'Quran for Adults': 'Coran pour adultes',
  'Noorani Qaida': 'Qaïda Nourania',
  'Arabic': 'Arabe',
  'Arabic for Non-Arabs': 'Arabe pour non-arabophones',
  'Quranic Arabic': 'Arabe du Coran',
  'Islamic Studies': 'Études islamiques',
  'Islamic Studies for Kids': 'Études islamiques pour enfants',
  'Tafseer': 'Tafsir',
  'Seerah': 'Sîra',
  'Aqeedah': 'Aqida',
  'Revision Techniques': 'Techniques de révision',
}

export function specialtyLabel(tag: string, locale: Locale): string {
  return locale === 'fr' ? SPECIALTY_LABELS_FR[tag] ?? tag : tag
}
