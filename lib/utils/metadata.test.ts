import { describe, expect, it } from 'vitest';
import { pageMetadata, pageTitle, shareImageUrl } from './metadata.ts';

describe('pageTitle', () => {
  it('ends with the brand', () => {
    expect(pageTitle('Tours from Lahore', '[BRAND NAME]')).toBe('Tours from Lahore | [BRAND NAME]');
  });
});

describe('pageMetadata', () => {
  it('sets the title, description, Open Graph and a large Twitter card', () => {
    const metadata = pageMetadata({ title: 'Photo credits', description: 'Who took the photos.' }, { brand: { name: 'North' } });
    expect(metadata).toEqual({
      title: 'Photo credits | North',
      description: 'Who took the photos.',
      openGraph: { title: 'Photo credits | North', description: 'Who took the photos.', siteName: 'North', type: 'website' },
      twitter: { card: 'summary_large_image', title: 'Photo credits | North', description: 'Who took the photos.' },
    });
  });
});

describe('shareImageUrl', () => {
  it('is root-relative while the site URL is a placeholder', () => {
    expect(shareImageUrl('/images/hero/hunza.jpg', '[Site URL]')).toBe('/images/hero/hunza-share.jpg');
  });

  it('is absolute once the site URL is set', () => {
    expect(shareImageUrl('/images/hero/hunza.jpg', 'https://example.pk')).toBe(
      'https://example.pk/images/hero/hunza-share.jpg',
    );
  });
});
