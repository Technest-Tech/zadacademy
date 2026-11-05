export const siteConfig = {
  name: 'Zad Academy',
  nameArabic: 'أكاديمية زاد',
  tagline: 'Learn Quran Online — 1-on-1 Classes with Certified Teachers',
  description:
    'Premium online Quran, Arabic language, and Islamic studies academy. 1-on-1 classes with certified teachers from Al-Azhar. Free trial available.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zadacademiq.com',
  email: 'zadacademiq@gmail.com',
  phone: '+33 7 80 93 30 87',
  whatsapp: '33780933087',
  whatsappDefaultMessage:
    'Assalamu alaikum, je souhaiterais en savoir plus sur vos cours de Coran.',
  address: 'Online — Serving students worldwide',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61591750688347',
    instagram: 'https://www.instagram.com/zadacademiq414/',
    youtube: '',
    twitter: '',
  },
} as const

/**
 * Every pre-filled message is in French, on the English pages too: that is the
 * language the academy wants to receive them in. This is why the `wa*` entries
 * in the English dictionary are French.
 */
export function whatsappLink(message?: string) {
  const text = message ?? siteConfig.whatsappDefaultMessage
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`
}
