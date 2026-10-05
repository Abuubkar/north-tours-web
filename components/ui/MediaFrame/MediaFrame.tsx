import type { CSSProperties } from 'react';
import { fallbackSrc, IMAGE_FORMATS, IMAGE_TYPES, objectPosition, PORTRAIT_MEDIA, PORTRAIT_SIZES, portraitSrcSet, variantSrcSet } from '@/lib/utils/images';
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
  '4:5': styles.wide4x5,
};

/**
 * A photo in AVIF, WebP or JPEG at the width the screen needs (ADR-0015), or, until the photo
 * exists, the design's striped placeholder naming the shot, read out as an image by its alt. A
 * hero's `portrait` crop goes to upright phones (ADR-0033); its focus sits at the same percentage
 * across the crop, so the one `object-position` frames both.
 */
export function MediaFrame({ image, ratio, wideRatio, sizes, priority = false, portrait = false, className }: MediaFrameProps) {
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
      {portrait &&
        IMAGE_FORMATS.map((format) => (
          <source key={format} media={PORTRAIT_MEDIA} type={IMAGE_TYPES[format]} srcSet={portraitSrcSet(image, format)} sizes={PORTRAIT_SIZES} />
        ))}
      <source type={IMAGE_TYPES.avif} srcSet={variantSrcSet(image, 'avif')} sizes={sizes} />
      <source type={IMAGE_TYPES.webp} srcSet={variantSrcSet(image, 'webp')} sizes={sizes} />
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
