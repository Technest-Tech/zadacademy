import Image from 'next/image'

type Props = {
  src: string | null
  /** Above-the-fold covers load first; the rest stay lazy. */
  priority?: boolean
  sizes: string
  className?: string
}

/**
 * Article covers are flat illustrations stored in /public/images/blog
 * (1200x675 WebP, about 20 KB). They are decorative — the title sits next to
 * them — so the alt text stays empty. Covers from elsewhere are skipped
 * rather than risk a host next/image is not allowed to load.
 */
export function BlogCover({ src, priority = false, sizes, className }: Props) {
  if (!src || !src.startsWith('/')) return null
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      // `priority` is deprecated in Next 16: it adds a preload but leaves the
      // <img> lazy at low fetch priority, so the LCP cover arrived last.
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className ?? 'object-cover'}
    />
  )
}
