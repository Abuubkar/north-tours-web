import type { Image } from '@/lib/content/images';

/** Frame shape: `fill` takes its parent's box (the full-bleed hero, never rounded); the rest are fixed ratios. */
export type MediaFrameRatio = 'fill' | '4:3' | '3:4' | '4:5';

export type MediaFrameProps = {
  /** A photo from content, or a placeholder naming the shot it should be. */
  image: Image;
  ratio: MediaFrameRatio;
  /** How wide the frame shows at each breakpoint, for the browser to pick a variant, e.g. "(width >= 820px) 25vw, 100vw". */
  sizes: string;
  /** The page's main image (LCP): loads straight away with high priority. Others load lazily. */
  priority?: boolean;
  className?: string;
};
