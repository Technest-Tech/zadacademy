import { NextResponse, type NextRequest } from 'next/server'

// Next 16 renamed the `middleware` convention to `proxy`. This file also owns
// locale routing for the public marketing site: French lives under a `/fr`
// prefix, English stays unprefixed. The `/fr` prefix is stripped and the target
// route is served with an `x-locale` request header that server code reads
// (see src/i18n/getLocale.ts).

const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST!   // app.zadacademiq.com OR app.localhost:3000
const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST! // zadacademiq.com OR localhost:3000

const LOCALE_HEADER = 'x-locale'

function isAppHost(host: string) {
  return (
    host === APP_HOST ||
    host === `app-staging.${SITE_HOST}` ||
    host.startsWith('app.localhost')
  )
}

const MARKETING_PATHS = [
  '/courses', '/pricing', '/faq', '/contact', '/blog', '/countries',
]

const SYSTEM_PATHS = [
  '/dashboard', '/students', '/teachers', '/leads',
  '/calendar', '/payments', '/quality',
  '/billing', '/payroll', '/accounting', '/certificates',
  '/notifications', '/whatsapp-groups', '/whatsapp', '/settings', '/audit-log',
  '/users', '/teacher', '/analytics', '/salary-tiers', '/site',
]

/** Forward the request to `pathname`, tagging it with the active locale. */
function serve(req: NextRequest, pathname: string, locale: 'en' | 'fr', mode: 'next' | 'rewrite') {
  const headers = new Headers(req.headers)
  headers.set(LOCALE_HEADER, locale)
  if (mode === 'next' && pathname === req.nextUrl.pathname) {
    return NextResponse.next({ request: { headers } })
  }
  const url = req.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.rewrite(url, { request: { headers } })
}

export function proxy(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  const matchesPath = (list: string[], path: string) =>
    list.some(p => path === p || path.startsWith(p + '/'))

  if (isAppHost(host)) {
    // The app host is the admin console — English only, no marketing site.
    if (pathname === '/' || matchesPath(MARKETING_PATHS, pathname)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return serve(req, pathname, 'en', 'next')
  }

  // ── Public marketing site (site host) ──
  // Resolve locale from the `/fr` prefix, then run the rest of the routing on
  // the un-prefixed path.
  let locale: 'en' | 'fr' = 'en'
  let basePath = pathname
  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    locale = 'fr'
    basePath = pathname.slice(3) || '/' // drop '/fr'
    if (!basePath.startsWith('/')) basePath = '/' + basePath
  }

  // System paths are not part of the public site — hide them behind the 404.
  if (matchesPath(SYSTEM_PATHS, basePath)) {
    return serve(req, '/not-found', locale, 'rewrite')
  }

  return serve(req, basePath, locale, 'next')
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|logo).*)'],
}
