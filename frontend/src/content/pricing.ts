/* ============================================================
   Pricing content — lesson-package model
   Mirrors the backend pricing model: a per-lesson base price by
   session duration (30 / 45 / 60 min), with volume discounts as
   the student books larger packages.
   Prices are computed at render time from `basePricePerLesson`
   × lesson count × (1 − discount), so editing a base price or a
   discount updates every card consistently.
   ============================================================ */

import type { Locale } from '@/i18n/config'

export type DurationId = '30' | '45' | '60'
export type CurrencyCode = 'USD' | 'EUR'

export type Duration = {
  id: DurationId
  label: string
  minutes: number
}

export const durations: Duration[] = [
  { id: '30', label: '30 min', minutes: 30 },
  { id: '45', label: '45 min', minutes: 45 },
  { id: '60', label: '60 min', minutes: 60 },
]

export type Currency = {
  code: CurrencyCode
  symbol: string
  label: string
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
]

/** Base price for a single lesson, by duration and currency. */
export const basePricePerLesson: Record<DurationId, Record<CurrencyCode, number>> = {
  '30': { USD: 5, EUR: 5 },
  '45': { USD: 7.5, EUR: 7 },
  '60': { USD: 10, EUR: 9 },
}

/** Icon keys map to lucide icons in the PricingPlans component. */
export type PackageIcon =
  | 'sprout'
  | 'book'
  | 'graduation'
  | 'star'
  | 'crown'
  | 'gem'

export type PricingPackage = {
  id: string
  name: string
  tagline: string
  /** short pill shown top-right of the card */
  badge: string
  icon: PackageIcon
  lessons: number
  /** volume discount applied to the base price, 0–1 */
  discount: number
  featured?: boolean
  ctaLabel: string
}

export const pricingPackages: PricingPackage[] = [
  {
    id: 'discovery',
    name: 'Discovery',
    tagline: 'Perfect for taking your first steps and discovering our method.',
    badge: 'Starter',
    icon: 'sprout',
    lessons: 4,
    discount: 0,
    ctaLabel: 'Choose this package',
  },
  {
    id: 'hafiz',
    name: 'Hafiz',
    tagline: 'To settle into a steady, regular learning rhythm.',
    badge: 'Regular',
    icon: 'book',
    lessons: 8,
    discount: 0.04,
    ctaLabel: 'Choose this package',
  },
  {
    id: 'mujtahid',
    name: 'Mujtahid',
    tagline: 'Make serious progress at a committed pace.',
    badge: 'Advance',
    icon: 'graduation',
    lessons: 12,
    discount: 0.08,
    ctaLabel: 'Choose this package',
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Our balanced formula for lasting, consistent results.',
    badge: 'Most chosen',
    icon: 'star',
    lessons: 24,
    discount: 0.12,
    featured: true,
    ctaLabel: 'Choose this package',
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'An advanced commitment for rapid mastery.',
    badge: 'Best value',
    icon: 'crown',
    lessons: 48,
    discount: 0.16,
    ctaLabel: 'Choose this package',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tagline: 'The ultimate package for complete immersion.',
    badge: 'Immersion',
    icon: 'gem',
    lessons: 100,
    discount: 0.2,
    ctaLabel: 'Choose this package',
  },
]

/** Feature icons map to lucide icons in the page component. */
export type IncludedIcon =
  | 'gift'
  | 'graduation'
  | 'certificate'
  | 'clock'
  | 'book'
  | 'shield'

export type IncludedFeature = {
  icon: IncludedIcon
  title: string
  desc: string
}

export const includedFeatures: IncludedFeature[] = [
  {
    icon: 'gift',
    title: 'Free trial lesson',
    desc: 'Try our method with no obligation.',
  },
  {
    icon: 'graduation',
    title: 'Al-Azhar certified teachers',
    desc: 'Learn with graduates — for men, women and children.',
  },
  {
    icon: 'certificate',
    title: 'Certificate of completion',
    desc: 'Awarded at the end of your programme.',
  },
  {
    icon: 'clock',
    title: 'Flexible scheduling',
    desc: 'Classes arranged around your timetable.',
  },
  {
    icon: 'book',
    title: 'Materials of your choice',
    desc: 'Quran, Tajwid, Arabic & Islamic studies.',
  },
  {
    icon: 'shield',
    title: 'Cancel anytime',
    desc: 'No contracts, no lock-in, no hidden fees.',
  },
]

export type PricingFaqItem = { q: string; a: string }

export const pricingFaqs: PricingFaqItem[] = [
  {
    q: 'How does package pricing work?',
    a: 'You buy a package of lessons at a fixed per-lesson price. The more lessons you book at once, the lower the price per lesson — the discount is applied automatically and shown on every card.',
  },
  {
    q: 'Is the first lesson really free?',
    a: 'Yes. Every student gets their first lesson completely free, with no card required. We only take payment once you decide to continue.',
  },
  {
    q: 'Do my lessons expire?',
    a: 'Your lessons stay valid as long as you keep booking regularly. If life gets in the way, message us on WhatsApp and we will extend your package.',
  },
  {
    q: 'What happens if I miss a lesson?',
    a: 'Free rescheduling with 24 hours notice. Lessons cancelled with less than 24 hours notice are counted against your package.',
  },
  {
    q: 'Can I choose a male or female teacher?',
    a: 'Absolutely. Teacher preferences — including gender — can be set when you book your trial and changed at any time on WhatsApp.',
  },
  {
    q: 'Which currencies and payment methods do you accept?',
    a: 'You can view prices in USD or EUR, and we accept all major credit and debit cards as well as PayPal. Payments are processed securely.',
  },
]

export const pricingPageContent = {
  hero: {
    eyebrow: 'First lesson offered',
    heading: 'Clear packages for stress-free learning',
    highlight: 'stress-free learning',
    subheading:
      'The more lessons you book, the lower the price per lesson. Choose the duration that suits you and start with a free, no-obligation trial.',
  },
  included: {
    eyebrow: 'The same guarantees for everyone',
    heading: 'Included in every package',
    highlight: 'every package',
    subheading: 'The same guarantees for everyone, whichever plan you choose.',
  },
  guarantee: {
    badge: 'No commitment',
    heading: 'Not sure which package is right for you?',
    body: 'Our team will advise you free of charge to pick the formula that suits your level and your goals — and we will offer you your first lesson free.',
    ctaPrimary: 'Book my free trial',
    ctaSecondary: 'Chat on WhatsApp',
  },
  cta: {
    heading: 'Ready to begin your Quran journey?',
    subheading:
      "Book a free trial on any package. We'll recommend the right fit based on your level and schedule.",
    ctaPrimary: 'Book Free Trial',
    ctaSecondary: 'Chat on WhatsApp',
  },
}

/* ============================================================
   French mirrors — used when the active locale is 'fr'.
   The English exports above remain the untouched default.
   ============================================================ */

export const pricingPackagesFr: PricingPackage[] = [
  {
    id: 'discovery',
    name: 'Discovery',
    tagline: 'Parfait pour faire vos premiers pas et découvrir notre méthode.',
    badge: 'Découverte',
    icon: 'sprout',
    lessons: 4,
    discount: 0,
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'hafiz',
    name: 'Hafiz',
    tagline: 'Pour installer un rythme d’apprentissage régulier et constant.',
    badge: 'Régulier',
    icon: 'book',
    lessons: 8,
    discount: 0.04,
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'mujtahid',
    name: 'Mujtahid',
    tagline: 'Progressez sérieusement à un rythme soutenu.',
    badge: 'Avancé',
    icon: 'graduation',
    lessons: 12,
    discount: 0.08,
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Notre formule équilibrée pour des résultats durables et constants.',
    badge: 'Le plus choisi',
    icon: 'star',
    lessons: 24,
    discount: 0.12,
    featured: true,
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Un engagement avancé pour une maîtrise rapide.',
    badge: 'Meilleur rapport qualité-prix',
    icon: 'crown',
    lessons: 48,
    discount: 0.16,
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tagline: 'Le forfait ultime pour une immersion complète.',
    badge: 'Immersion',
    icon: 'gem',
    lessons: 100,
    discount: 0.2,
    ctaLabel: 'Choisir ce forfait',
  },
]

export function getPricingPackages(locale: Locale): PricingPackage[] {
  return locale === 'fr' ? pricingPackagesFr : pricingPackages
}

export const includedFeaturesFr: IncludedFeature[] = [
  {
    icon: 'gift',
    title: 'Cours d’essai gratuit',
    desc: 'Essayez notre méthode sans aucun engagement.',
  },
  {
    icon: 'graduation',
    title: 'Enseignants certifiés Al-Azhar',
    desc: 'Apprenez avec des diplômés — pour hommes, femmes et enfants.',
  },
  {
    icon: 'certificate',
    title: 'Certificat de fin de formation',
    desc: 'Délivré à l’issue de votre programme.',
  },
  {
    icon: 'clock',
    title: 'Horaires flexibles',
    desc: 'Des cours organisés selon votre emploi du temps.',
  },
  {
    icon: 'book',
    title: 'Supports de votre choix',
    desc: 'Coran, Tajwid, arabe et sciences islamiques.',
  },
  {
    icon: 'shield',
    title: 'Annulation à tout moment',
    desc: 'Sans contrat, sans engagement et sans frais cachés.',
  },
]

export function getIncludedFeatures(locale: Locale): IncludedFeature[] {
  return locale === 'fr' ? includedFeaturesFr : includedFeatures
}

export const pricingFaqsFr: PricingFaqItem[] = [
  {
    q: 'Comment fonctionne la tarification par forfait ?',
    a: 'Vous achetez un forfait de cours à un prix fixe par cours. Plus vous réservez de cours à la fois, plus le prix par cours est bas — la remise est appliquée automatiquement et affichée sur chaque carte.',
  },
  {
    q: 'Le premier cours est-il vraiment gratuit ?',
    a: 'Oui. Chaque élève bénéficie de son premier cours entièrement gratuit, sans carte bancaire requise. Nous ne prélevons de paiement qu’une fois que vous décidez de continuer.',
  },
  {
    q: 'Mes cours expirent-ils ?',
    a: 'Vos cours restent valables tant que vous continuez à réserver régulièrement. Si un imprévu survient, écrivez-nous sur WhatsApp et nous prolongerons votre forfait.',
  },
  {
    q: 'Que se passe-t-il si je manque un cours ?',
    a: 'Report gratuit avec un préavis de 24 heures. Les cours annulés avec moins de 24 heures de préavis sont décomptés de votre forfait.',
  },
  {
    q: 'Puis-je choisir un enseignant homme ou femme ?',
    a: 'Tout à fait. Les préférences d’enseignant — y compris le genre — peuvent être définies lors de la réservation de votre essai et modifiées à tout moment sur WhatsApp.',
  },
  {
    q: 'Quelles devises et quels moyens de paiement acceptez-vous ?',
    a: 'Vous pouvez consulter les prix en USD ou en EUR, et nous acceptons toutes les principales cartes de crédit et de débit ainsi que PayPal. Les paiements sont traités en toute sécurité.',
  },
]

export function getPricingFaqs(locale: Locale): PricingFaqItem[] {
  return locale === 'fr' ? pricingFaqsFr : pricingFaqs
}

export const pricingPageContentFr: typeof pricingPageContent = {
  hero: {
    eyebrow: 'Premier cours offert',
    heading: 'Des forfaits clairs pour un apprentissage serein',
    highlight: 'un apprentissage serein',
    subheading:
      'Plus vous réservez de cours, plus le prix par cours est bas. Choisissez la durée qui vous convient et commencez par un essai gratuit et sans engagement.',
  },
  included: {
    eyebrow: 'Les mêmes garanties pour tous',
    heading: 'Inclus dans chaque forfait',
    highlight: 'chaque forfait',
    subheading: 'Les mêmes garanties pour tous, quel que soit le forfait que vous choisissez.',
  },
  guarantee: {
    badge: 'Sans engagement',
    heading: 'Vous ne savez pas quel forfait vous convient ?',
    body: 'Notre équipe vous conseille gratuitement pour choisir la formule adaptée à votre niveau et à vos objectifs — et nous vous offrons votre premier cours gratuitement.',
    ctaPrimary: 'Réserver mon essai gratuit',
    ctaSecondary: 'Discuter sur WhatsApp',
  },
  cta: {
    heading: 'Prêt à commencer votre parcours avec le Coran ?',
    subheading:
      'Réservez un essai gratuit sur n’importe quel forfait. Nous vous recommanderons la formule idéale selon votre niveau et votre emploi du temps.',
    ctaPrimary: 'Réserver un essai gratuit',
    ctaSecondary: 'Discuter sur WhatsApp',
  },
}

export function getPricingPageContent(locale: Locale) {
  return locale === 'fr' ? pricingPageContentFr : pricingPageContent
}
