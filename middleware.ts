import NextAuth, { Session } from "next-auth"
import { NextRequest } from 'next/server';

import authConfig from "./auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req: NextRequest & { auth: Session | null }): Response | void  => {
  const { nextUrl } = req;
  
  // Allow access to API routes for authentication
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return;
  }
  
  // Allow access to static assets
  if (
    nextUrl.pathname.startsWith('/_next/') || 
    nextUrl.pathname.startsWith('/images/') || 
    nextUrl.pathname === '/favicon.ico'
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
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}