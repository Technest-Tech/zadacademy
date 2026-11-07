import type { Locale } from '@/i18n/config'

export type Testimonial = {
  id: string
  name: string
  location: string
  country: string
  quote: string
  course: string
  rating: number
}

/**
 * Real reviews only — from families who took classes and agreed to be quoted.
 * Empty until the first ones come in; the homepage section stays hidden until
 * then.
 */
export const testimonialsFr: Testimonial[] = []

/** Same reviews on the English site, in the families' own words. */
export const testimonials: Testimonial[] = testimonialsFr

export function getTestimonials(locale: Locale): Testimonial[] {
  return locale === 'fr' ? testimonialsFr : testimonials
}
