import type { CSSProperties } from 'react';
import { fallbackSrc, objectPosition, variantSrcSet } from '@/lib/utils/images';
import type { MediaFrameProps, MediaFrameRatio, MediaFrameWideRatio } from './MediaFrame.types';
import styles from './MediaFrame.module.css';

const ratioClass: Record<MediaFrameRatio, string> = {
  fill: styles.fill,
  '4:3': styles.ratio4x3,
  '3:4': styles.ratio3x4,
  '4:5': styles.ratio4x5,
  '16:10': styles.ratio16x10,
};

const wideRatioClass: Record<MediaFrameWideRatio, string> = {
  '21:9': styles.wide21x9,
};

/**
 * A photo in AVIF, WebP or JPEG at the width the screen needs (ADR-0015), or, until the photo
 * exists, the design's striped placeholder naming the shot, read out as an image by its alt.
 */
export function MediaFrame({ image, ratio, wideRatio, sizes, priority = false, className }: MediaFrameProps) {
  const frame = [styles.frame, ratioClass[ratio], wideRatio && wideRatioClass[wideRatio], className].filter(Boolean).join(' ');

  if ('placeholder' in image) {
    return (
      // A <span> (shown as a block), so a placeholder is valid inside a button or a link, as a <picture> is.
      <span role="img" aria-label={image.alt} className={`${frame} ${styles.placeholder}`} data-surface="dark">
        <span className={styles.caption}>{image.placeholder}</span>
      </span>
    );
  }

  return (
    <picture className={frame}>
      <source type="image/avif" srcSet={variantSrcSet(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={variantSrcSet(image, 'webp')} sizes={sizes} />
      <img
        className={styles.img}
        src={fallbackSrc(image)}
        srcSet={variantSrcSet(image, 'jpg')}
        sizes={sizes}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
        style={{ '--focus': objectPosition(image.focus) } as CSSProperties}
      />
    </picture>
  );
}
