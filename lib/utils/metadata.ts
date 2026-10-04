import type { Metadata } from 'next';
import type { Settings } from '../content/settings.ts';
import { shareSrc } from './images.ts';
import { isPlaceholder } from './placeholder.ts';

/** "{page title} | {brand}": page copy holds only the page's part. */
export function pageTitle(title: string, brand: string): string {
  return `${title} | ${brand}`;
}

/**
 * Title, description, Open Graph and Twitter tags for a page. The share image is added by
 * `ShareImageMeta`, since its URL can't be absolute until the site URL is known.
 */
export function pageMetadata(
  page: { title: string; description: string },
  settings: Pick<Settings, 'brand'>,
): Metadata {
  const title = pageTitle(page.title, settings.brand.name);
  const { description } = page;
  return {
    title,
    description,
    openGraph: { title, description, siteName: settings.brand.name, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/**
 * The share image's URL. Open Graph wants an absolute URL, but the domain isn't known yet
 * (ADR-0007): while the site URL is a `[placeholder]` it's root-relative.
 */
export function shareImageUrl(src: string, siteUrl: string): string {
  const path = shareSrc(src);
  return isPlaceholder(siteUrl) ? path : new URL(path, siteUrl).href;
}
