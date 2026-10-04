import type { Photo } from '@/lib/content/images';

export type ShareImageMetaProps = {
  /** The page's hero photo; its 1200×630 share crop is the share image. */
  photo: Pick<Photo, 'src' | 'alt'>;
  /** From settings: a `[placeholder]` until the domain is known. */
  siteUrl: string;
};
