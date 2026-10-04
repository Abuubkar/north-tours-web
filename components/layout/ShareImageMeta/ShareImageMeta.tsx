import { SHARE_IMAGE } from '@/lib/utils/images';
import { shareImageUrl } from '@/lib/utils/metadata';
import type { ShareImageMetaProps } from './ShareImageMeta.types';

/**
 * The page's share image for Open Graph and Twitter. React places these tags in <head>.
 * They're rendered here, not through Next's metadata, which would turn a root-relative URL
 * into a localhost one while the site URL is still a placeholder.
 */
export function ShareImageMeta({ photo, siteUrl }: ShareImageMetaProps) {
  const url = shareImageUrl(photo.src, siteUrl);
  return (
    <>
      <meta property="og:image" content={url} />
      <meta property="og:image:width" content={String(SHARE_IMAGE.width)} />
      <meta property="og:image:height" content={String(SHARE_IMAGE.height)} />
      <meta property="og:image:alt" content={photo.alt} />
      <meta name="twitter:image" content={url} />
    </>
  );
}
