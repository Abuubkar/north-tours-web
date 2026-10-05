import type { Photo } from '../content/images.ts';
import { sitePath } from './basePath.ts';

/*
 * Image variants (ADR-0015). `pnpm images` writes them and `MediaFrame` reads them, both from
 * these names, so the two always agree. Nothing here is stored in content.
 */

/** Widths every photo is resized to, smallest first. A photo gets those up to its own width. */
export const IMAGE_WIDTHS = [480, 800, 1200, 1600, 2400] as const;

/** Newest first, as `<picture>` lists them; JPEG is the fallback every browser reads. */
export const IMAGE_FORMATS = ['avif', 'webp', 'jpg'] as const;

export type ImageFormat = (typeof IMAGE_FORMATS)[number];

/** The share image (Open Graph, WhatsApp previews), cropped from a page's hero photo. */
export const SHARE_IMAGE = { width: 1200, height: 630 } as const;

/** Where in a photo the subject is, in percent from the top-left. The centre when not set. */
export type Focus = NonNullable<Photo['focus']>;

const CENTRE: Focus = { x: 50, y: 50 };

/** The widths a photo of this width is resized to; never larger than the photo. */
export function variantWidths(width: number): number[] {
  return IMAGE_WIDTHS.filter((w) => w <= width);
}

const extension = /\.[a-z]+$/;

/** "/images/hunza/attabad.jpg" at 800 as WebP → "/images/hunza/attabad-800.webp", the file in public. */
export function variantFile(src: string, width: number, format: ImageFormat): string {
  return src.replace(extension, `-${width}.${format}`);
}

/** The `srcset` for one format: every variant width of the photo, under the base path. */
export function variantSrcSet(photo: Pick<Photo, 'src' | 'width'>, format: ImageFormat): string {
  return variantWidths(photo.width)
    .map((w) => `${sitePath(variantFile(photo.src, w, format))} ${w}w`)
    .join(', ');
}

/** Browsers without `srcset` get one JPEG: the largest up to this width. */
const FALLBACK_MAX_WIDTH = 1200;

/** The `src` for browsers without `srcset`, under the base path. */
export function fallbackSrc(photo: Pick<Photo, 'src' | 'width'>): string {
  const widths = variantWidths(photo.width).filter((w) => w <= FALLBACK_MAX_WIDTH);
  return sitePath(variantFile(photo.src, widths[widths.length - 1], 'jpg'));
}

/** "/images/hunza/attabad.jpg" → "/images/hunza/attabad-share.jpg", the file in public. */
export function shareFile(src: string): string {
  return src.replace(extension, '-share.jpg');
}

/*
 * Phone-shaped crops of the full-bleed hero photos (ADR-0033). On an upright phone a hero is
 * about 2:3, so the landscape photo is cropped to its height and only its middle third shows. A
 * 2:3 crop around the focus carries that same view in a file a third as wide.
 */

/** The portrait crop's shape, width to height. */
export const PORTRAIT_RATIO = { width: 2, height: 3 } as const;

/**
 * The screens that get the portrait crop: upright phones. A hero's box there is about 2:3
 * (390×600 for a tour, 454×768 for the Homepage's bleed), so the crop shows what the landscape
 * photo would. On wider screens the box turns square or wide and the crop would zoom in.
 */
export const PORTRAIT_MEDIA = '(max-width: 479px) and (orientation: portrait)';

/**
 * The portrait widths, each no wider than the crop. With `PORTRAIT_SIZES`, a phone whose screen is
 * at most 800 device pixels wide (390px up to DPR 2, Lighthouse's 412px at DPR 1.75) picks the 800;
 * sharper screens (DPR 2.6 and 3) the 1200.
 */
export const PORTRAIT_WIDTHS = [800, 1200] as const;

/** The portrait crop always fills the screen's width: `sizes` for its sources. */
export const PORTRAIT_SIZES = '100vw';

/** The largest 2:3 box inside the photo, in the photo's pixels. */
function portraitBox(photo: Pick<Photo, 'width' | 'height'>) {
  const { width, height } = PORTRAIT_RATIO;
  return photo.width * height > photo.height * width
    ? { width: Math.round((photo.height * width) / height), height: photo.height }
    : { width: photo.width, height: Math.round((photo.width * height) / width) };
}

/**
 * The region of the photo to cut for its portrait crop: the largest 2:3 box around the focus, at
 * the photo's own scale. The focus lands at the same percentage across the crop as across the
 * photo, so `object-position` at the focus frames both alike.
 */
export function portraitCrop(photo: Pick<Photo, 'width' | 'height' | 'focus'>) {
  return coverCrop(photo, portraitBox(photo), photo.focus).extract;
}

/** The widths the portrait crop is resized to: `PORTRAIT_WIDTHS`, each capped at the crop's own width (never enlarged). */
export function portraitWidths(photo: Pick<Photo, 'width' | 'height'>): number[] {
  const crop = portraitBox(photo).width;
  return [...new Set(PORTRAIT_WIDTHS.map((w) => Math.min(w, crop)))];
}

/** "/images/hunza/attabad.jpg" at 800 as AVIF → "/images/hunza/attabad-portrait-800.avif", the file in public. */
export function portraitFile(src: string, width: number, format: ImageFormat): string {
  return src.replace(extension, `-portrait-${width}.${format}`);
}

/** The `srcset` of the portrait crop in one format, under the base path. */
export function portraitSrcSet(photo: Pick<Photo, 'src' | 'width' | 'height'>, format: ImageFormat): string {
  return portraitWidths(photo)
    .map((w) => `${sitePath(portraitFile(photo.src, w, format))} ${w}w`)
    .join(', ');
}

/** CSS `object-position` for the focus, e.g. "30% 60%". */
export function objectPosition(focus: Focus = CENTRE): string {
  return `${focus.x}% ${focus.y}%`;
}

/**
 * The crop that fills a `target` frame from a photo, as `object-fit: cover` with
 * `object-position` at the focus would: scale the photo to cover the frame, then place the
 * focus point at the same percentage across the frame. Returns the scaled size and the
 * region to cut from it.
 */
export function coverCrop(
  photo: Pick<Photo, 'width' | 'height'>,
  target: Pick<Photo, 'width' | 'height'>,
  focus: Focus = CENTRE,
) {
  const scale = Math.max(target.width / photo.width, target.height / photo.height);
  const width = Math.max(target.width, Math.round(photo.width * scale));
  const height = Math.max(target.height, Math.round(photo.height * scale));
  return {
    resize: { width, height },
    extract: {
      left: Math.round(((width - target.width) * focus.x) / 100),
      top: Math.round(((height - target.height) * focus.y) / 100),
      width: target.width,
      height: target.height,
    },
  };
}
