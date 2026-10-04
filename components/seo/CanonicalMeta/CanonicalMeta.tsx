import { siteUrlFor } from '@/lib/utils/siteUrl';
import type { CanonicalMetaProps } from './CanonicalMeta.types';

/**
 * The page's canonical URL and `og:url`, from the URL rule. React places these tags in <head>.
 * They're rendered here, not through Next's metadata, which would turn a root-relative URL
 * into a localhost one while the site URL is still a placeholder.
 */
export function CanonicalMeta({ path, siteUrl }: CanonicalMetaProps) {
  const url = siteUrlFor(path, siteUrl);
  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </>
  );
}
