import NextAuth, { Session } from "next-auth"
import { NextRequest, NextResponse } from 'next/server';

import authConfig from "./auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth: middleware } = NextAuth(authConfig)

/**
 * Where consent is legally required before storing the attribution cookie:
 * the EEA (EU 27 + Iceland, Liechtenstein, Norway), the UK under PECR, and
 * Switzerland. Everywhere else has no equivalent opt-in rule for a first-party
 * cookie used only for our own measurement.
 */
const CONSENT_REQUIRED_COUNTRIES = new Set([
  // EU 27
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // EEA
  "IS", "LI", "NO",
  // UK (PECR) and Switzerland
  "GB", "CH",
]);

const REGION_COOKIE = "ov_region";

/**
 * Tell the browser whether this visitor has to be asked before we store the
 * attribution cookie.
 *
 * FAILS SAFE, DELIBERATELY. An unreadable, missing, or unrecognised country
 * resolves to "eu", meaning ask. Geolocation is not perfect — VPNs, corporate
 * proxies, and travellers all defeat it — and the two ways of being wrong are
 * not equal. Asking someone who did not need to be asked costs a little
 * attribution. NOT asking someone who did is the failure that gets you fined.
 * So every uncertain case takes the expensive side.
 *
 * This lives in middleware rather than the layout on purpose. Reading headers()
 * in a server component would opt the whole marketing tree out of static
 * generation, and /[...slug] — every comparison page we are about to buy ads
 * for — is prerendered today. Middleware keeps those pages on the CDN.
 *
 * Written once per browser, not per request, so a cached page is not re-cookied
 * on every hit.
 */
function withRegionCookie(req: NextRequest): NextResponse {
  const res = NextResponse.next();

  if (req.cookies.get(REGION_COOKIE)) return res;

  const country =
    (req as NextRequest & { geo?: { country?: string } }).geo?.country ||
    req.headers.get("x-vercel-ip-country") ||
    null;

  const region =
    country && !CONSENT_REQUIRED_COUNTRIES.has(country.toUpperCase())
      ? "row"
      : "eu";

  res.cookies.set(REGION_COOKIE, region, {
    path: "/",
    sameSite: "lax",
    httpOnly: false, // the banner is client-side and has to read this
    secure: req.nextUrl.protocol === "https:",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Page not found — Omnia Voice</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#FAFAF9;color:#1a1a1a;
       font:400 16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  main{text-align:center;padding:2rem}
  h1{font-size:3rem;margin:0 0 .5rem;letter-spacing:-.02em}
  p{margin:0 0 1.5rem;color:rgba(26,26,26,.6)}
  a{display:inline-block;padding:.75rem 1.5rem;background:#1a1a1a;color:#fff;
    text-decoration:none;font-size:.875rem;letter-spacing:.02em}
  a:hover{background:#333}
</style></head>
<body><main>
  <h1>404</h1>
  <p>That page doesn't exist.</p>
  <a href="/">Back to Omnia Voice</a>
</main></body></html>`

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Parse Accept header and compare q-values for text/markdown vs text/html
  let mdQ = -1;
  let htmlQ = -1;
  for (const raw of accept.split(",")) {
    const parts = raw.trim().split(";");
    const type = parts[0].trim().toLowerCase();
    let q = 1;
    for (const p of parts.slice(1)) {
      const m = p.trim().match(/^q=([0-9.]+)$/i);
      if (m) q = parseFloat(m[1]);
    }
    if (type === "text/markdown") mdQ = Math.max(mdQ, q);
    else if (type === "text/html") htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > 0 && mdQ >= htmlQ;
}

export default middleware((req: NextRequest & { auth: Session | null }): Response | void  => {
  const { nextUrl } = req;

  // Markdown content negotiation on the homepage — agents that send
  // Accept: text/markdown get the markdown representation (llm.txt).
  // In either case, set Vary: Accept so caches differentiate HTML vs markdown.
  if (nextUrl.pathname === "/") {
    if (prefersMarkdown(req.headers.get("accept"))) {
      const res = NextResponse.rewrite(new URL("/api/markdown", nextUrl));
      res.headers.set("Vary", "Accept");
      res.headers.set("Content-Location", "/api/markdown");
      return res;
    }
  }

  // Allow access to API routes for authentication
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return;
  }
  
  // Allow access to static assets and well-known agent/crawler files
  if (
    nextUrl.pathname.startsWith('/_next/') ||
    nextUrl.pathname.startsWith('/images/') ||
    nextUrl.pathname.startsWith('/.well-known/') ||
    nextUrl.pathname === '/favicon.ico' ||
    nextUrl.pathname === '/robots.txt' ||
    nextUrl.pathname === '/sitemap.xml' ||
    nextUrl.pathname === '/llm.txt' ||
    nextUrl.pathname === '/note.txt' ||
    nextUrl.pathname === '/site.webmanifest'
  ) {
    return;
  }
  
  // Deny by default. A path is served only if `publicRoutes` lists it, either
  // exactly or as the parent of a `/prefix/...` child. Everything else is
  // refused — stale routes, half-finished pages, anything we never meant to
  // publish. Publishing a new page means adding it to publicRoutes on purpose.
  const isPublicRoute = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  );

  if (!isPublicRoute) {
    // 404 — deliberately NOT a redirect to "/".
    //
    // Redirecting sent crawlers to a page that answers 200, which search
    // engines read as a soft 404 and may keep indexed under the original URL.
    // That is how the shadcn starter-kit boilerplate at /docs and /guides
    // stayed in Google under our own brand: every one of those paths answered
    // 200, so nothing ever told a crawler to drop them.
    //
    // A hard 404 plus `X-Robots-Tag: noindex` is the signal that actually
    // removes them.
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  }

  return withRegionCookie(req);
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  // `docs` and `guides` are 301'd to guide.omnia-voice.com in next.config.js.
  // They are excluded here so the redirect fires before auth middleware runs —
  // otherwise the deny-by-default 404 below would shadow it.
  //
  // `llms.txt` / `llms-full.txt` / `llm.txt` are static files in public/ that
  // describe the site to language models. They are excluded because
  // publicRoutes does not list them, so the deny-by-default 404 would otherwise
  // hide them from exactly the readers they exist for — which is what was
  // happening to /llms.txt.
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|docs|guides|llms\\.txt|llms-full\\.txt|llm\\.txt|note.txt|site.webmanifest|\\.well-known).*)'],
}