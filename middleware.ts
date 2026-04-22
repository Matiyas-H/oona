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
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  );
  
  if (!isPublicRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }
  
  return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|llm.txt|note.txt|site.webmanifest|\\.well-known).*)'],
}