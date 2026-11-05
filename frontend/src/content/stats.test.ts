import { describe, it, expect } from 'vitest'
import { parseStatValue, stats, statsFr } from '@/content/stats'

describe('parseStatValue', () => {
  it('reads thousands in either language', () => {
    expect(parseStatValue('1,500+')).toEqual({ num: 1500, suffix: '+', decimals: 0 })
    expect(parseStatValue('1 500+')).toEqual({ num: 1500, suffix: '+', decimals: 0 })
    expect(parseStatValue('1 500+')).toEqual({ num: 1500, suffix: '+', decimals: 0 })
    expect(parseStatValue('1 500+')).toEqual({ num: 1500, suffix: '+', decimals: 0 })
  })

  it('reads a decimal in either language', () => {
    expect(parseStatValue('4.9★')).toEqual({ num: 4.9, suffix: '★', decimals: 1 })
    expect(parseStatValue('4,9★')).toEqual({ num: 4.9, suffix: '★', decimals: 1 })
  })

  it('reads plain figures', () => {
    expect(parseStatValue('50+')).toEqual({ num: 50, suffix: '+', decimals: 0 })
    expect(parseStatValue('100+')).toEqual({ num: 100, suffix: '+', decimals: 0 })
  })

  it('counts up to the same figures in both languages', () => {
    expect(stats.map((s) => parseStatValue(s.value).num)).toEqual(
      statsFr.map((s) => parseStatValue(s.value).num),
    )
  })
})
