import { courses } from './courses'

/**
 * Topical demo thumbnails pulled from the web (loremflickr, keyword + stable lock).
 * Swap these for real branded course thumbnails when available.
 */
const IMAGE_KEYWORDS: Record<string, string> = {
  'noorani-qaida': 'quran,arabic,book',
  'quran-classes-for-kids': 'child,quran',
  'quran-classes-for-adults': 'quran,reading',
  'tajweed-course': 'quran,mosque',
  'hifz-memorization': 'quran,book',
  'ijazah-program': 'quran,calligraphy',
  'arabic-for-non-arabs': 'arabic,calligraphy',
  'tafseer-course': 'quran,study',
  'islamic-studies': 'mosque,islamic',
  'ten-qiraat': 'quran,recitation',
  'female-quran-teachers': 'hijab,book',
}

export function courseImage(slug: string): string {
  const kw = IMAGE_KEYWORDS[slug] ?? 'quran,islamic'
  const idx = Math.max(0, courses.findIndex((c) => c.slug === slug))
  return `https://loremflickr.com/800/520/${kw}?lock=${100 + idx}`
}
