/**
 * Crawlers and link previewers are never redirected to the default language:
 * each language has to stay reachable at its own stable URL for the hreflang
 * pair in src/lib/seo.ts to mean anything. Googlebot must still see the English
 * site at the English URL.
 */
const BOT_AGENT =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|discord|embedly|preview|lighthouse|pingdom|headlesschrome/i

export function isBot(userAgent: string | null): boolean {
  return !!userAgent && BOT_AGENT.test(userAgent)
}
