import type { Locale } from '@/i18n/config'

export type Stat = {
  value: string
  label: string
  description?: string
}

export const stats: Stat[] = [
  { value: '1,600', label: 'Students enrolled', description: 'Children, teenagers and adults' },
  { value: '20', label: 'Teachers', description: 'Men and women, 1-on-1 classes' },
  { value: '7 days', label: 'A week', description: 'From 8 am to 10 pm' },
  { value: '1st', label: 'Class free', description: 'No card, no commitment' },
]

export const statsFr: Stat[] = [
  { value: '1 600', label: 'Élèves en cours', description: 'Enfants, adolescents et adultes' },
  { value: '20', label: 'Enseignants', description: 'Hommes et femmes, en cours particuliers' },
  { value: '7j/7', label: 'De 8 h à 22 h', description: 'Des horaires adaptés à votre famille' },
  { value: '1er', label: 'Cours offert', description: 'Sans carte bancaire, sans engagement' },
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
