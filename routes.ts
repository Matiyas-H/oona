/**
 * The complete allowlist of publicly reachable paths.
 *
 * The middleware denies by default: a path is served only if it appears here
 * (exactly, or as a `/prefix/...` child). Anything else returns a hard 404.
 * Adding a marketing page therefore means adding it here too — that is
 * deliberate, so nothing reaches the public web by accident.
 *
 * Two entries were removed once we found them serving starter-kit boilerplate
 * to crawlers under our own brand:
 *
 *   /docs    Was rendering the shadcn "Taxonomy" template docs ("Welcome to the
 *            Next SaaS Stripe Starter documentation").
 *
 *   /guides  Was rendering the template's own tutorials ("using-next-auth-next-13",
 *            "build-blog-using-contentlayer-mdx"). Nothing of ours lives there.
 *
 * Both are now 301'd to guide.omnia-voice.com in next.config.js, and both are
 * excluded from the middleware matcher so the redirect fires before the
 * deny-by-default 404 below can shadow it. They must NOT be listed here.
 *
 * app/(docs)/ and content/docs|guides are now unreachable and can be deleted.
 *
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/blog",
  "/contact",
  "/partners",
  "/pricing",
  "/privacy",
  "/terms",

  // Comparison pages. Served by app/(marketing)/[...slug] from
  // content/pages/*.mdx. Listed individually rather than behind a prefix
  // because the slugs are the search terms people actually type
  // ("vapi alternative"), and a /compare/ prefix would bury that.
  //
  // Deny-by-default means a new comparison page is invisible until it is added
  // here. That is deliberate: a page reaches the public web because someone
  // decided it should, not because a file appeared in a directory.
  "/vapi-alternative",
  "/retell-alternative",
  "/bland-alternative",
  "/elevenlabs-alternative",
  "/deepgram-alternative",
  "/openai-realtime-alternative",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/auth/error",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";