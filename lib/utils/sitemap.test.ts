import { describe, expect, it } from 'vitest';
import { robotsTxt, sitemapUrls } from './sitemap.ts';

const slugs = { tours: ['hunza-express', 'skardu-deosai'], destinations: ['hunza'] };

describe('sitemapUrls', () => {
  it('lists every route-map page and every tour and destination, once each', () => {
    expect(sitemapUrls(slugs, '[Site URL]')).toEqual([
      '/',
      '/tours',
      '/plan',
      '/about',
      '/help',
      '/contact',
      '/privacy',
      '/terms',
      '/credits',
      '/tours/hunza-express',
      '/tours/skardu-deosai',
      '/destinations/hunza',
    ]);
  });

  it('has no anchors, queries, 404 or duplicates', () => {
    const urls = sitemapUrls({ tours: ['hunza-express', 'hunza-express'], destinations: [] }, '[Site URL]');
    expect(urls.filter((url) => /[#?]|404/.test(url))).toEqual([]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('is absolute with a real site URL', () => {
    const urls = sitemapUrls(slugs, 'https://example.pk/');
    expect(urls[0]).toBe('https://example.pk/');
    expect(urls).toContain('https://example.pk/tours/hunza-express');
    expect(urls.every((url) => url.startsWith('https://example.pk/'))).toBe(true);
  });
});

describe('robotsTxt', () => {
  it('allows everything and names no sitemap while the site URL is a placeholder', () => {
    expect(robotsTxt('[Site URL]')).toEqual({ rules: { userAgent: '*', allow: '/' } });
  });

  it('names the absolute sitemap once the site URL is real', () => {
    expect(robotsTxt('https://example.pk')).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://example.pk/sitemap.xml',
    });
  });
});
