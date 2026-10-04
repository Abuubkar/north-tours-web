import { isPlaceholder } from './placeholder.ts';

/**
 * The URL rule (PRD #94): a path on the site, absolute once the settings site URL is real, and
 * root-relative while it's still a `[placeholder]` (the domain isn't known yet, ADR-0007).
 * Canonical URLs, `og:url`, share images, the sitemap, robots.txt and JSON-LD all use it.
 */
export function siteUrlFor(path: string, siteUrl: string): string {
  const rooted = path.startsWith('/') ? path : `/${path}`;
  return isPlaceholder(siteUrl) ? rooted : `${siteUrl.replace(/\/+$/, '')}${rooted}`;
}
