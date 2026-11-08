/**
 * Dial-code picker options for the WhatsApp field, French-speaking countries
 * first. `code` is the ISO alpha-2 code the API stores as the visitor's country.
 *
 * `digits` is the length of the national mobile number without its trunk
 * prefix (the leading 0, or 1 in North America), and `mobile` what that
 * number starts with. WhatsApp only runs on mobile numbers, so a landline or
 * a number of the wrong length is refused before it reaches the CRM.
 * `example` doubles as the input's placeholder.
 */
export const PHONE_COUNTRIES = [
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France', digits: [9], mobile: /^[67]/, example: '6 12 34 56 78' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgique', digits: [9], mobile: /^4/, example: '470 12 34 56' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Suisse', digits: [9], mobile: /^7/, example: '78 123 45 67' },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxembourg', digits: [9], mobile: /^6/, example: '628 123 456' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada', digits: [10], mobile: /^[2-9]\d{2}[2-9]/, example: '514 555 0123' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Maroc', digits: [9], mobile: /^[67]/, example: '612 345 678' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algérie', digits: [9], mobile: /^[567]/, example: '551 23 45 67' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisie', digits: [8], mobile: /^[2459]/, example: '20 123 456' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', digits: [10], mobile: /^7/, example: '7400 123456' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States', digits: [10], mobile: /^[2-9]\d{2}[2-9]/, example: '201 555 0123' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany', digits: [10, 11], mobile: /^1[5-7]/, example: '151 23456789' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands', digits: [9], mobile: /^6/, example: '6 12345678' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE', digits: [9], mobile: /^5/, example: '50 123 4567' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', digits: [9], mobile: /^5/, example: '51 234 5678' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar', digits: [8], mobile: /^[3567]/, example: '3312 3456' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt', digits: [10], mobile: /^1[0125]/, example: '100 123 4567' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey', digits: [10], mobile: /^5/, example: '501 234 56 78' },
] as const

export type PhoneCountry = (typeof PHONE_COUNTRIES)[number]
export type PhoneCountryCode = PhoneCountry['code']

/** The longest number a visitor may type for this country: national digits plus a trunk prefix. */
export function maxTypedDigits(country: PhoneCountry): number {
  return Math.max(...country.digits) + 1
}

/** Keeps only digits and spaces, and no more digits than the country allows. */
export function limitPhoneInput(value: string, country: PhoneCountry): string {
  // A pasted international number (+33 6…, 0033 6…) already carries the dial code
  // the picker adds, so drop it rather than cutting the end of the number off.
  const code = country.dial.slice(1)
  value = value.trimStart().replace(new RegExp(`^(\\+|00)\\s*${code}[\\s.-]*`), '')
  // Typed key by key, "+33" arrives as "+", "+3", "+33": keep the + until the code is complete.
  const plus = value.startsWith('+')
  const max = maxTypedDigits(country) + (plus ? 3 : 0)
  let digits = 0
  let out = plus ? '+' : ''
  for (const ch of value) {
    if (ch >= '0' && ch <= '9') {
      if (digits === max) break
      digits++
      out += ch
    } else if (ch === ' ' && out !== '' && !out.endsWith(' ')) {
      out += ch
    }
  }
  return out
}

/**
 * The national number without its trunk prefix (06 12… → 612…, 1 514… → 514…),
 * or null when it is not a valid mobile number for that country.
 */
export function normalizeMobile(value: string, country: PhoneCountry): string | null {
  let digits = value.replace(/\D/g, '')
  const lengths: readonly number[] = country.digits
  const longest = Math.max(...lengths)
  if (country.dial === '+1') {
    if (digits.length === longest + 1 && digits.startsWith('1')) digits = digits.slice(1)
  } else if (digits.length > Math.min(...lengths) && digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  return lengths.includes(digits.length) && country.mobile.test(digits) ? digits : null
}
