import { describe, it, expect } from 'vitest'
import {
  pricingPackages, pricingPackagesFr, packagePrice, lessonRate,
  durationPriceFactor, BASE_DURATION, type DurationId, type CurrencyCode,
} from '@/content/pricing'

describe('duration pricing', () => {
  it('leaves the 60-minute prices exactly as quoted', () => {
    const silver = pricingPackages.find(p => p.id === 'silver')!
    expect(packagePrice(silver, 'EUR', '60')).toBe(145.99)
    expect(packagePrice(silver, 'USD', '60')).toBe(157.99)
  })

  it('derives 45 and 30 minutes at 80% and 60%', () => {
    const silver = pricingPackages.find(p => p.id === 'silver')!
    expect(packagePrice(silver, 'EUR', '45')).toBe(116.79)
    expect(packagePrice(silver, 'EUR', '30')).toBe(87.59)
    expect(packagePrice(silver, 'USD', '45')).toBe(126.39)
    expect(packagePrice(silver, 'USD', '30')).toBe(94.79)
  })

  it('defaults to the 60-minute price when no duration is given', () => {
    for (const pkg of pricingPackages) {
      for (const c of ['EUR', 'USD'] as CurrencyCode[]) {
        expect(packagePrice(pkg, c)).toBe(packagePrice(pkg, c, BASE_DURATION))
      }
    }
  })

  it('never returns a fractional cent', () => {
    for (const pkg of [...pricingPackages, ...pricingPackagesFr]) {
      for (const c of ['EUR', 'USD'] as CurrencyCode[]) {
        for (const d of Object.keys(durationPriceFactor) as DurationId[]) {
          const p = packagePrice(pkg, c, d)
          // Round-tripping through 2dp must be identity: `p * 100` cannot be
          // used to test this — 76.99 * 100 is 7698.999... in binary floating
          // point, which would fail a correct price.
          expect(Number(p.toFixed(2))).toBe(p)
        }
      }
    }
  })

  it('keeps a shorter lesson cheaper than a longer one, every package', () => {
    for (const pkg of pricingPackages) {
      for (const c of ['EUR', 'USD'] as CurrencyCode[]) {
        expect(packagePrice(pkg, c, '30')).toBeLessThan(packagePrice(pkg, c, '45'))
        expect(packagePrice(pkg, c, '45')).toBeLessThan(packagePrice(pkg, c, '60'))
      }
    }
  })

  it('charges more per minute as the lesson gets shorter', () => {
    for (const pkg of pricingPackages) {
      const perMin = (d: DurationId, m: number) => packagePrice(pkg, 'EUR', d) / pkg.lessons / m
      expect(perMin('30', 30)).toBeGreaterThan(perMin('45', 45))
      expect(perMin('45', 45)).toBeGreaterThan(perMin('60', 60))
    }
  })

  it('holds the descending per-lesson ladder at every duration', () => {
    for (const set of [pricingPackages, pricingPackagesFr]) {
      for (const c of ['EUR', 'USD'] as CurrencyCode[]) {
        for (const d of Object.keys(durationPriceFactor) as DurationId[]) {
          const rates = set.map(p => lessonRate(p, c, d))
          rates.forEach((r, i) => { if (i) expect(r).toBeLessThan(rates[i - 1]) })
        }
      }
    }
  })

  it('keeps EN and FR price sets identical', () => {
    for (const d of Object.keys(durationPriceFactor) as DurationId[]) {
      for (const c of ['EUR', 'USD'] as CurrencyCode[]) {
        expect(pricingPackagesFr.map(p => packagePrice(p, c, d)))
          .toEqual(pricingPackages.map(p => packagePrice(p, c, d)))
      }
    }
  })
})
