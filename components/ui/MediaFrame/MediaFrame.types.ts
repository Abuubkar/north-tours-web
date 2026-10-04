import type { ContentImage } from '@/lib/content/images';

/** Frame shape: `fill` takes its parent's box (the full-bleed hero, never rounded); the rest are fixed ratios. */
export type MediaFrameRatio = 'fill' | '4:3' | '3:4' | '4:5' | '16:10';

/** A frame's ratio from 820px, when it differs from its ratio below: the About header is 4:3 on phones, 21:9 wider. */
export type MediaFrameWideRatio = '21:9';

export type MediaFrameProps = {
  /** A photo from content, or a placeholder naming the shot it should be. */
  image: ContentImage;
  ratio: MediaFrameRatio;
  /** The ratio from 820px, when it differs from `ratio` (CSS only: one image, cropped at its focus). */
  wideRatio?: MediaFrameWideRatio;
  /** How wide the frame shows at each breakpoint, for the browser to pick a variant, e.g. "(width >= 820px) 25vw, 100vw". */
  sizes: string;
  /** The page's main image (LCP): loads straight away with high priority. Others load lazily. */
  priority?: boolean;
  className?: string;
};
