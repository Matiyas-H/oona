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

  return;
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