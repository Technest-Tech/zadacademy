import { describe, it, expect } from 'vitest'
import { siteConfig, whatsappLink } from '@/config/site'
import { en } from '@/i18n/dictionaries/en'
import { fr } from '@/i18n/dictionaries/fr'
import { getPricingPackages, packageWhatsappMessage } from '@/content/pricing'

const NUMBER = '33780933087'

/** The text a wa.me link will pre-fill. */
const textOf = (href: string) => new URL(href).searchParams.get('text')

describe('whatsappLink', () => {
  it('opens a chat with the academy’s number', () => {
    expect(siteConfig.whatsapp).toBe(NUMBER)
    expect(new URL(whatsappLink()).pathname).toBe(`/${NUMBER}`)
  })

  it('pre-fills French when no message is given', () => {
    expect(textOf(whatsappLink())).toBe(siteConfig.whatsappDefaultMessage)
    expect(siteConfig.whatsappDefaultMessage).toContain('je souhaiterais')
  })
})

describe('pre-filled messages', () => {
  it('are French on the English pages too', () => {
    expect(en.success.waTrial).toBe(fr.success.waTrial)
    expect(en.success.waContact).toBe(fr.success.waContact)
    expect(en.faqPage.waMessage).toBe(fr.faqPage.waMessage)
    expect(en.pricingPlans.waMessage).toBe(fr.pricingPlans.waMessage)
    expect(en.coursePage.waInterested).toBe(fr.coursePage.waInterested)
    expect(en.teacherPage.waBook).toBe(fr.teacherPage.waBook)
    expect(en.countryPage.waLearnMore).toBe(fr.countryPage.waLearnMore)
    expect(en.countryPage.waBookTrial).toBe(fr.countryPage.waBookTrial)
  })
})

describe('packageWhatsappMessage', () => {
  const [first] = getPricingPackages('fr')

  it('quotes the package, length and price the visitor selected', () => {
    const message = packageWhatsappMessage(first, 'EUR', '30')
    expect(message).toContain(`forfait ${first.name}`)
    expect(message).toContain(`${first.lessons} cours de 30 minutes`)
    expect(message).toMatch(/19,99\s€/)
  })

  it('follows the selectors', () => {
    const message = packageWhatsappMessage(first, 'USD', '60')
    expect(message).toContain(`${first.lessons} cours de 60 minutes`)
    expect(message).toMatch(/43,99\s\$/)
  })

  it('survives the trip through the link', () => {
    const message = packageWhatsappMessage(first, 'EUR', '30')
    expect(textOf(whatsappLink(message))).toBe(message)
  })
})
