import {
  Cormorant_Garamond,
  Fraunces,
  Inter,
  Amiri,
} from 'next/font/google'

export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  // No italic: nothing sets the display font in italics, and the italic file
  // was preloaded on every page.
  style: ['normal'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const fontHeading = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const fontArabic = Amiri({
  subsets: ['arabic'],
  // Regular only: no Arabic text on the site is bold, yet the ~100 KB bold
  // file was preloaded on every page.
  weight: ['400'],
  variable: '--font-amiri',
  display: 'swap',
})
