import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/content/settings';
import { robotsTxt } from '@/lib/utils/sitemap';

/** Written once at build, for the static export (ADR-0002). */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return robotsTxt(getSettings().site.url);
}
