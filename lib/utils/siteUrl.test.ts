import { describe, expect, it } from 'vitest';
import { siteUrlFor } from './siteUrl.ts';

describe('siteUrlFor', () => {
  it('joins a real site URL and a path, with or without a trailing slash', () => {
    expect(siteUrlFor('/tours', 'https://example.pk')).toBe('https://example.pk/tours');
    expect(siteUrlFor('/tours', 'https://example.pk/')).toBe('https://example.pk/tours');
  });

  it('takes a path with or without its leading slash', () => {
    expect(siteUrlFor('tours/hunza-express', 'https://example.pk')).toBe('https://example.pk/tours/hunza-express');
    expect(siteUrlFor('/', 'https://example.pk/')).toBe('https://example.pk/');
  });

  it('is root-relative while the site URL is a placeholder', () => {
    expect(siteUrlFor('/tours', '[Site URL]')).toBe('/tours');
    expect(siteUrlFor('tours', '[Site URL]')).toBe('/tours');
  });
});
