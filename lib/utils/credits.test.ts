import { describe, expect, it } from 'vitest';
import type { ContentImage } from '../content/images.ts';
import { licenceUrl, photoCredits } from './credits.ts';

const wikimedia = (src: string): ContentImage => ({
  src,
  alt: `Photo ${src}`,
  width: 1200,
  height: 800,
  credit: { source: 'wikimedia', author: 'A. Author', licence: 'CC BY-SA 4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.jpg' },
});

describe('photoCredits', () => {
  it('lists every third-party photo once, in order', () => {
    const credits = photoCredits([wikimedia('/images/a.jpg'), wikimedia('/images/b.jpg'), wikimedia('/images/a.jpg')]);
    expect(credits.map((c) => c.src)).toEqual(['/images/a.jpg', '/images/b.jpg']);
    expect(credits[0]).toEqual({
      src: '/images/a.jpg',
      alt: 'Photo /images/a.jpg',
      source: 'wikimedia',
      author: 'A. Author',
      licence: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.jpg',
    });
  });

  it('leaves out the owner’s photos and placeholders', () => {
    const owner: ContentImage = { src: '/images/team.jpg', alt: 'The team', width: 800, height: 1000, credit: { source: 'owner' } };
    const placeholder: ContentImage = { placeholder: 'Karimabad at dawn', alt: 'Karimabad' };
    expect(photoCredits([owner, placeholder, wikimedia('/images/a.jpg')]).map((c) => c.src)).toEqual(['/images/a.jpg']);
  });
});

describe('licenceUrl', () => {
  it('links Creative Commons licences to their deed', () => {
    expect(licenceUrl('CC BY-SA 4.0')).toBe('https://creativecommons.org/licenses/by-sa/4.0/');
    expect(licenceUrl('CC BY 2.0')).toBe('https://creativecommons.org/licenses/by/2.0/');
    expect(licenceUrl('CC0 1.0')).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
  });

  it('has no link for other licences', () => {
    expect(licenceUrl('Unsplash License')).toBeUndefined();
  });
});
