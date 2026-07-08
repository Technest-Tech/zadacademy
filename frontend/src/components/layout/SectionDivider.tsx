import { cn } from '@/lib/utils'

type SectionDividerProps = {
  /** `light` for use on cream/white backgrounds, `dark` for navy/green backgrounds. */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Ornamental splitter placed at the top of a section to separate it from the
 * one above. A thin gold-fading rule with a small diamond centrepiece.
 */
export function SectionDivider({ tone = 'light', className }: SectionDividerProps) {
  const line = tone === 'dark' ? 'via-white/20' : 'via-accent/30'
  const diamond = tone === 'dark' ? 'bg-accent/70' : 'bg-accent'

  return (
    <div
      className={cn('flex items-center justify-center gap-3 pt-8 sm:pt-10', className)}
      aria-hidden="true"
    >
      <span className={cn('h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-transparent', line)} />
      <span className="relative flex items-center justify-center">
        <span className={cn('size-2 rotate-45 rounded-[1px]', diamond)} />
      </span>
      <span className={cn('h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-transparent', line)} />
    </div>
  )
}
