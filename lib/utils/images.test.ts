import { describe, expect, it } from 'vitest';
import {
  coverCrop,
  fallbackSrc,
  objectPosition,
  portraitCrop,
  portraitFile,
  portraitSrcSet,
  portraitWidths,
  shareFile,
  variantFile,
  variantSrcSet,
  variantWidths,
} from './images.ts';

describe('variant names', () => {
  it('adds the width and format to the source name', () => {
    expect(variantFile('/images/hunza/attabad.jpg', 800, 'webp')).toBe('/images/hunza/attabad-800.webp');
    expect(variantFile('/images/hunza/attabad.jpeg', 480, 'jpg')).toBe('/images/hunza/attabad-480.jpg');
  });

  it('names the share crop', () => {
    expect(shareFile('/images/hero/hunza.jpg')).toBe('/images/hero/hunza-share.jpg');
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

describe('portrait crops (ADR-0033)', () => {
  const home = { width: 2560, height: 1707, focus: { x: 47, y: 0 } };

  it('cuts the largest 2:3 box at the photo’s own scale', () => {
    expect(portraitCrop(home)).toEqual({ left: 668, top: 0, width: 1138, height: 1707 });
    // A photo taller than 2:3 keeps its width and is cut in height, around the focus.
    expect(portraitCrop({ width: 1000, height: 2000, focus: { x: 50, y: 25 } })).toEqual({ left: 0, top: 125, width: 1000, height: 1500 });
  });

  it('centres the crop without a focus, and stays inside the photo at the edges', () => {
    expect(portraitCrop({ width: 1200, height: 800 }).left).toBe(334);
    expect(portraitCrop({ width: 1200, height: 800, focus: { x: 0, y: 50 } }).left).toBe(0);
    expect(portraitCrop({ width: 1200, height: 800, focus: { x: 100, y: 50 } }).left).toBe(1200 - 533);
  });

  it('puts the focus at the same percentage across the crop as across the photo, so one object-position frames both', () => {
    for (const focus of [{ x: 47, y: 0 }, { x: 30, y: 40 }, { x: 70, y: 45 }, { x: 100, y: 100 }]) {
      for (const photo of [home, { width: 1200, height: 668, focus }, { width: 1020, height: 800, focus }]) {
        const crop = portraitCrop({ ...photo, focus });
        const x = ((focus.x / 100) * photo.width - crop.left) / crop.width;
        const y = ((focus.y / 100) * photo.height - crop.top) / crop.height;
        expect(x * 100).toBeCloseTo(focus.x, 0);
        expect(y * 100).toBeCloseTo(focus.y, 0);
      }
    }
  });

  it('is resized to 800 and 1200, each capped at the crop’s width, never enlarged', () => {
    expect(portraitWidths({ width: 4000, height: 3000 })).toEqual([800, 1200]);
    expect(portraitWidths(home)).toEqual([800, 1138]);
    expect(portraitWidths({ width: 1200, height: 800 })).toEqual([533]);
    expect(portraitWidths({ width: 1200, height: 668 })).toEqual([445]);
  });

  it('names the files and lists them under the base path', () => {
    expect(portraitFile('/images/hunza/attabad.jpg', 800, 'avif')).toBe('/images/hunza/attabad-portrait-800.avif');
    expect(portraitSrcSet({ src: '/images/a.jpg', ...home }, 'webp')).toBe('/images/a-portrait-800.webp 800w, /images/a-portrait-1138.webp 1138w');
  });
});
