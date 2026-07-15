export const siteConfig = {
  name: 'Zad Academy',
  nameArabic: 'أكاديمية زاد',
  tagline: 'Learn Quran Online — 1-on-1 Classes with Certified Teachers',
  description:
    'Premium online Quran, Arabic language, and Islamic studies academy. 1-on-1 classes with certified teachers from Al-Azhar. Free trial available.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zadacademiq.com',
  email: 'zadacademiq@gmail.com',
  phone: '+44 7468 904245',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '447468904245',
  whatsappDefaultMessage:
    'Assalamu alaikum, I would like to learn more about your Quran classes.',
  address: 'Online — Serving students worldwide',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61591750688347',
    instagram: 'https://www.instagram.com/zadacademiq414/',
    youtube: '',
    twitter: '',
  },
} as const

export function whatsappLink(message?: string) {
  const text = message ?? siteConfig.whatsappDefaultMessage
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`
}
