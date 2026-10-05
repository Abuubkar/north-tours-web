import { routes } from '../routes.ts';
import { sitePath } from './basePath.ts';
import { isPlaceholder } from './placeholder.ts';
import { siteUrlFor } from './siteUrl.ts';

/*
 * The sitemap and robots.txt (PRD #94), written at build by Next's metadata routes. URLs follow
 * the URL rule: absolute once the site URL is real, root-relative while it's a placeholder.
 */

/** The route map's pages: every plain path, without anchors such as /about#guides or /help#policies. */
const PAGES = Object.values(routes).flatMap((route) => (typeof route === 'string' && !route.includes('#') ? [route] : []));

/**
 * Every page once: the route map's pages, then each tour and destination. No anchors, queries or
 * 404, and no `lastmod`, `changefreq` or `priority` (search engines ignore the last two, and the
 * build date isn't a real change date).
 */
export function sitemapUrls(slugs: { tours: string[]; destinations: string[] }, siteUrl: string): string[] {
  const paths = [...PAGES, ...slugs.tours.map(routes.tour), ...slugs.destinations.map(routes.destination)];
  return [...new Set(paths)].map((path) => siteUrlFor(path, siteUrl));
}

type RobotsRules = { rules: { userAgent: string; allow?: string; disallow?: string }; sitemap?: string };

/**
 * robots.txt: everything allowed, and the sitemap named only once its URL can be absolute. A
 * `noindex` build (the preview, ADR-0032) disallows everything and names no sitemap.
 */
export function robotsRules(siteUrl: string, noindex: boolean): RobotsRules {
  if (noindex) return { rules: { userAgent: '*', disallow: '/' } };
  const rules = { userAgent: '*', allow: '/' };
  return isPlaceholder(siteUrl) ? { rules } : { rules, sitemap: siteUrlFor(sitePath('/sitemap.xml'), siteUrl) };
}
