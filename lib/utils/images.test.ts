import { describe, expect, it } from 'vitest';
import {
  coverCrop,
  fallbackSrc,
  objectPosition,
  shareSrc,
  variantSrc,
  variantSrcSet,
  variantWidths,
} from './images.ts';

describe('variant names', () => {
  it('adds the width and format to the source name', () => {
    expect(variantSrc('/images/hunza/attabad.jpg', 800, 'webp')).toBe('/images/hunza/attabad-800.webp');
    expect(variantSrc('/images/hunza/attabad.jpeg', 480, 'jpg')).toBe('/images/hunza/attabad-480.jpg');
  });

  it('names the share crop', () => {
    expect(shareSrc('/images/hero/hunza.jpg')).toBe('/images/hero/hunza-share.jpg');
  });
});

describe('variantWidths', () => {
  it('stops at the photo’s own width, never enlarging it', () => {
    expect(variantWidths(1200)).toEqual([480, 800, 1200]);
    expect(variantWidths(1500)).toEqual([480, 800, 1200]);
    expect(variantWidths(2560)).toEqual([480, 800, 1200, 1600, 2400]);
  });
});

describe('variantSrcSet and fallbackSrc', () => {
  const photo = { src: '/images/a.jpg', width: 1600 };

  it('lists every width in the format', () => {
    expect(variantSrcSet(photo, 'avif')).toBe(
      '/images/a-480.avif 480w, /images/a-800.avif 800w, /images/a-1200.avif 1200w, /images/a-1600.avif 1600w',
    );
  });

  it('falls back to the largest JPEG up to 1200px', () => {
    expect(fallbackSrc(photo)).toBe('/images/a-1200.jpg');
    expect(fallbackSrc({ src: '/images/a.jpg', width: 900 })).toBe('/images/a-800.jpg');
  });
});

describe('objectPosition', () => {
  it('centres by default and follows the focus', () => {
    expect(objectPosition()).toBe('50% 50%');
    expect(objectPosition({ x: 30, y: 70 })).toBe('30% 70%');
  });
});

describe('coverCrop', () => {
  const share = { width: 1200, height: 630 };

  it('scales a wide photo to the frame height and centres it', () => {
    expect(coverCrop({ width: 2400, height: 1000 }, share)).toEqual({
      resize: { width: 1512, height: 630 },
      extract: { left: 156, top: 0, width: 1200, height: 630 },
    });
  });

  it('scales a tall photo to the frame width', () => {
    const crop = coverCrop({ width: 1200, height: 1600 }, share);
    expect(crop.resize).toEqual({ width: 1200, height: 1600 });
    expect(crop.extract).toEqual({ left: 0, top: 485, width: 1200, height: 630 });
  });

  it('moves the crop towards the focus, staying inside the photo', () => {
    const photo = { width: 2400, height: 1600 };
    expect(coverCrop(photo, share, { x: 50, y: 0 }).extract.top).toBe(0);
    expect(coverCrop(photo, share, { x: 50, y: 100 }).extract.top).toBe(800 - 630);
  });
});
