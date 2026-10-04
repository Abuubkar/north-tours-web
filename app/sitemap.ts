import type { MetadataRoute } from 'next';
import { getDestinations, getTours } from '@/lib/content/catalog';
import { getSettings } from '@/lib/content/settings';
import { sitemapUrls } from '@/lib/utils/sitemap';

/** Written once at build, for the static export (ADR-0002). */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = { tours: getTours().map((tour) => tour.slug), destinations: getDestinations().map((d) => d.slug) };
  return sitemapUrls(slugs, getSettings().site.url).map((url) => ({ url }));
}
