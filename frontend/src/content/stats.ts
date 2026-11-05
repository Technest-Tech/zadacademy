import type { Locale } from '@/i18n/config'

export type Stat = {
  value: string
  label: string
  description?: string
}

export const stats: Stat[] = [
  { value: '1,500+', label: 'Students Taught', description: 'Across 50+ countries worldwide' },
  { value: '50+', label: 'Countries Served', description: 'From USA to Malaysia' },
  { value: '100+', label: 'Certified Teachers', description: 'Al-Azhar & Ijazah certified' },
  { value: '4.9★', label: 'Average Rating', description: 'From 2,000+ verified reviews' },
]

export const statsFr: Stat[] = [
  { value: '1 500+', label: 'Élèves formés', description: 'Dans plus de 50 pays à travers le monde' },
  { value: '50+', label: 'Pays desservis', description: 'Des États-Unis à la Malaisie' },
  { value: '100+', label: 'Enseignants certifiés', description: 'Certifiés Al-Azhar et Ijazah' },
  { value: '4,9★', label: 'Note moyenne', description: 'Sur plus de 2 000 avis vérifiés' },
]

/**
 * Split a display figure into its number and whatever follows it, understanding
 * both languages' spelling: `10,000+` and `1 500+` group thousands (French with
 * a space), while `4.9★` and `4,9★` carry a decimal. A comma counts as a
 * thousands separator only when exactly three digits follow it.
 */
export function parseStatValue(value: string): { num: number; suffix: string; decimals: number } {
  const match = value.match(/^(\d{1,3}(?:[,\s]\d{3})+|\d+)(?:[.,](\d+))?(.*)$/u)
  if (!match) return { num: 0, suffix: value, decimals: 0 }

  const [, whole, fraction = '', suffix] = match
  return {
    num: Number(`${whole.replace(/[,\s]/g, '')}.${fraction || '0'}`),
    suffix,
    decimals: fraction.length,
  }
}

export function getStats(locale: Locale): Stat[] {
  return locale === 'fr' ? statsFr : stats
}
