import { describe, it, expect } from 'vitest'
import { isBot } from './negotiate'

describe('isBot', () => {
  it('recognizes the crawlers that must see both languages', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true)
    expect(isBot('Mozilla/5.0 (compatible; bingbot/2.0)')).toBe(true)
    expect(isBot('facebookexternalhit/1.1')).toBe(true)
    expect(isBot('WhatsApp/2.19')).toBe(true)
  })

  it('leaves real browsers alone', () => {
    expect(
      isBot('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'),
    ).toBe(false)
    expect(isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1')).toBe(false)
    expect(isBot(null)).toBe(false)
  })
})
