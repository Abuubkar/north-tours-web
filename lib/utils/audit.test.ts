import { describe, expect, it } from 'vitest';
import {
  auditReport,
  auditTarget,
  builtPages,
  htmlTitle,
  judgeSite,
  median,
  medianVitals,
  overLimit,
  pageUrl,
  sitemapFailures,
  sitemapLocs,
  type PageAudit,
  type PageFacts,
} from './audit.ts';

const site = { files: new Set(['/index.html', '/images/hunza/attabad-share.jpg']), url: '[Site URL]', basePath: '' };

const facts = (width: number, change: Partial<PageFacts> = {}): PageFacts => ({
  width,
  h1s: 1,
  title: 'Tours | North',
  description: 'Every trip from Lahore.',
  ogImage: '/images/hunza/attabad-share.jpg',
  twitterImage: '/images/hunza/attabad-share.jpg',
  canonical: '/tours',
  ogUrl: '/tours',
  ...change,
});

/** A page that passes everything, with `change` applied. */
const audit = (change: Partial<PageAudit> = {}): PageAudit => ({
  page: '/tours',
  vitals: { lcp: 1800, cls: 0.02, tbt: 90 },
  runs: 1,
  facts: [facts(390), facts(1440)],
  violations: [],
  ...change,
});

/** The same page facts at another path, with its own canonical URL. */
const at = (page: string, change: Partial<PageFacts> = {}) => ({ page, facts: [facts(1440, { canonical: page, ogUrl: page, ...change })] });

const judge = (change: Partial<PageAudit> = {}) => judgeSite([audit(change)], site)[0];

describe('the audit’s pages', () => {
  it('lists every page in the build, nested tours and destinations and the 404 included', () => {
    const files = [
      'index.html',
      'tours.html',
      'tours/hunza-express.html',
      'destinations/hunza.html',
      '404.html',
      'tours.txt',
      'images/hunza/attabad-800.jpg',
    ];
    expect(builtPages(files)).toEqual(['/', '/404', '/destinations/hunza', '/tours', '/tours/hunza-express']);
  });

  it('reads the same pages from a base-path build, where each page is a folder (ADR-0032)', () => {
    const files = ['index.html', 'tours/index.html', 'tours/hunza-express/index.html', 'destinations/hunza/index.html', '404.html'];
    expect(builtPages(files)).toEqual(['/', '/404', '/destinations/hunza', '/tours', '/tours/hunza-express']);
  });

  it('skips Next’s internal files', () => {
    expect(builtPages(['_not-found.html', '_not-found/index.html', '_next/static/chunks/app.html', 'index.html'])).toEqual(['/']);
  });
});

describe('the median', () => {
  it('takes the middle of three runs, in any order', () => {
    expect(median([2600, 2200, 2400])).toBe(2400);
    expect(medianVitals([
      { lcp: 2600, cls: 0, tbt: 300 },
      { lcp: 2200, cls: 0.2, tbt: 100 },
      { lcp: 2400, cls: 0.05, tbt: 150 },
    ])).toEqual({ lcp: 2400, cls: 0.05, tbt: 150 });
  });

  it('reruns a page over LCP or CLS, not over TBT', () => {
    expect(overLimit({ lcp: 2500, cls: 0.1, tbt: 900 })).toBe(false);
    expect(overLimit({ lcp: 2501, cls: 0, tbt: 0 })).toBe(true);
    expect(overLimit({ lcp: 0, cls: 0.101, tbt: 0 })).toBe(true);
  });
});

describe('the audit’s judgement', () => {
  it('passes a page at the limits', () => {
    expect(judge({ vitals: { lcp: 2500, cls: 0.1, tbt: 200 } })).toMatchObject({ failures: [], warnings: [] });
  });

  it('fails LCP just over 2.5 s and CLS just over 0.1', () => {
    expect(judge({ vitals: { lcp: 2550, cls: 0.02, tbt: 90 } }).failures).toEqual(['LCP 2.55 s is over 2.50 s']);
    expect(judge({ vitals: { lcp: 1800, cls: 0.11, tbt: 90 } }).failures).toEqual(['CLS 0.110 is over 0.1']);
  });

  it('warns, without failing, on TBT over 200 ms', () => {
    expect(judge({ vitals: { lcp: 1800, cls: 0, tbt: 201 } })).toMatchObject({
      failures: [],
      warnings: ['TBT 201 ms is over 200 ms (the lab stand-in for INP)'],
    });
  });

  it('fails a page Lighthouse couldn’t measure', () => {
    expect(judge({ vitals: null }).failures).toEqual(['Lighthouse couldn’t measure the page']);
  });

  it('fails on any axe violation, naming the width, rule and elements', () => {
    const violations = [{ width: 390, rule: 'color-contrast', targets: ['.price', '.seats'] }];
    expect(judge({ violations }).failures).toEqual(['390px: axe color-contrast on .price, .seats']);
  });

  it('fails a page without exactly one <h1>, at the width it happens', () => {
    expect(judge({ facts: [facts(390, { h1s: 2 }), facts(1440)] }).failures).toEqual(['390px: 2 <h1>s']);
    expect(judge({ facts: [facts(390, { h1s: 0 }), facts(1440, { h1s: 0 })] }).failures).toEqual(['390px: no <h1>', '1440px: no <h1>']);
  });

  it('fails a page without a title or a description', () => {
    expect(judge({ facts: [facts(1440, { title: '' })] }).failures).toEqual(['1440px: no <title>']);
    expect(judge({ facts: [facts(1440, { description: '' })] }).failures).toEqual(['1440px: no meta description']);
  });

  it('fails a title another page shares, on both pages', () => {
    const verdicts = judgeSite([audit(at('/')), audit(at('/tours')), audit(at('/help', { title: 'Help | North' }))], site);
    expect(verdicts.map((v) => v.failures)).toEqual([
      ['<title> “Tours | North” is shared with /tours'],
      ['<title> “Tours | North” is shared with /'],
      [],
    ]);
  });

  it('fails a share image that’s missing or not in the build, root-relative or absolute', () => {
    expect(judge({ facts: [facts(1440, { twitterImage: '' })] }).failures).toEqual(['1440px: no twitter:image']);
    expect(judge({ facts: [facts(1440, { ogImage: '/images/gone-share.jpg' })] }).failures).toEqual([
      '1440px: og:image /images/gone-share.jpg isn’t in the build',
    ]);
    expect(judge({ facts: [facts(1440, { ogImage: 'https://example.pk/images/hunza/attabad-share.jpg' })] }).failures).toEqual([]);
  });
});

describe('the audit’s canonical and sitemap checks', () => {
  it('fails a page without a canonical URL, or with another URL than its own, but not the 404', () => {
    expect(judge({ facts: [facts(1440, { canonical: '' })] }).failures).toEqual(['1440px: no canonical URL']);
    expect(judge({ facts: [facts(1440, { canonical: '/', ogUrl: '/' })] }).failures).toEqual(['1440px: canonical URL / isn’t /tours']);
    expect(judge(at('/404', { canonical: '', ogUrl: '' })).failures).toEqual([]);
  });

  it('fails an og:url that isn’t the canonical URL', () => {
    expect(judge({ facts: [facts(1440, { ogUrl: '' })] }).failures).toEqual(['1440px: og:url (none) isn’t the canonical URL']);
  });

  it('wants absolute URLs once the site URL is real', () => {
    const real = { ...site, url: 'https://example.pk' };
    expect(judgeSite([audit()], real)[0].failures).toEqual([
      '390px: canonical URL /tours isn’t https://example.pk/tours',
      '1440px: canonical URL /tours isn’t https://example.pk/tours',
    ]);
    const absolute = facts(1440, { canonical: 'https://example.pk/tours', ogUrl: 'https://example.pk/tours' });
    expect(judgeSite([audit({ facts: [absolute] })], real)[0].failures).toEqual([]);
  });

  it('reads the sitemap’s URLs, and none without one', () => {
    expect(sitemapLocs('<urlset><url><loc>/</loc></url><url><loc>/tours</loc></url></urlset>')).toEqual(['/', '/tours']);
    expect(sitemapLocs(null)).toBeNull();
  });

  it('fails a page missing from the sitemap, a URL that isn’t a built page, or no sitemap, leaving out the 404', () => {
    const pages = ['/', '/404', '/tours', '/help'];
    expect(sitemapFailures(['/', '/tours', '/help'], pages, { url: '[Site URL]', basePath: '' })).toEqual([]);
    expect(sitemapFailures(['https://example.pk/', 'https://example.pk/tours', 'https://example.pk/help'], pages, { url: 'https://example.pk', basePath: '' })).toEqual([]);
    expect(sitemapFailures(['/', '/tours', '/plan'], pages, { url: '[Site URL]', basePath: '' })).toEqual([
      'The sitemap doesn’t list /help',
      'The sitemap lists /plan, which isn’t a built page',
    ]);
    expect(sitemapFailures(['/', '/tours', '/help'], pages, { url: 'https://example.pk', basePath: '' })).toHaveLength(6);
    expect(sitemapFailures(null, pages, { url: '[Site URL]', basePath: '' })).toEqual(['The build has no sitemap.xml']);
  });
});

describe('auditing a live site under a base path (ADR-0032)', () => {
  const preview = { ...site, basePath: '/north-tours-web' };
  const underBase = facts(1440, {
    canonical: '/north-tours-web/tours/',
    ogUrl: '/north-tours-web/tours/',
    ogImage: '/north-tours-web/images/hunza/attabad-share.jpg',
    twitterImage: 'https://abuubkar.github.io/north-tours-web/images/hunza/attabad-share.jpg',
  });

  it('splits --origin into the origin and the base path', () => {
    expect(auditTarget('https://abuubkar.github.io/north-tours-web')).toEqual({ origin: 'https://abuubkar.github.io', basePath: '/north-tours-web' });
    expect(auditTarget('https://abuubkar.github.io/north-tours-web/')).toEqual({ origin: 'https://abuubkar.github.io', basePath: '/north-tours-web' });
    expect(auditTarget('https://example.pk')).toEqual({ origin: 'https://example.pk', basePath: '' });
  });

  it('refuses an address that isn’t a plain http or https origin and path', () => {
    for (const address of ['abuubkar.github.io/north-tours-web', 'ftp://example.pk', 'https://example.pk/?x=1', 'https://example.pk/#top']) {
      expect(() => auditTarget(address)).toThrow(/--origin/);
    }
  });

  it('loads each built page at its URL under the base path, and locally at the root as before', () => {
    const live = auditTarget('https://abuubkar.github.io/north-tours-web');
    expect(pageUrl('/', live)).toBe('https://abuubkar.github.io/north-tours-web/');
    expect(pageUrl('/tours/hunza-express', live)).toBe('https://abuubkar.github.io/north-tours-web/tours/hunza-express/');
    expect(pageUrl('/tours/hunza-express', { origin: 'https://127.0.0.1:4173', basePath: '' })).toBe('https://127.0.0.1:4173/tours/hunza-express');
  });

  it('wants canonical URLs under the base path, and finds share images in the build through it', () => {
    expect(judgeSite([audit({ facts: [underBase] })], preview)[0].failures).toEqual([]);
    expect(judgeSite([audit({ facts: [facts(1440)] })], preview)[0].failures).toEqual([
      '1440px: og:image /images/hunza/attabad-share.jpg isn’t in the build',
      '1440px: twitter:image /images/hunza/attabad-share.jpg isn’t in the build',
      '1440px: canonical URL /tours isn’t /north-tours-web/tours/',
    ]);
  });

  it('wants the sitemap’s URLs under the base path', () => {
    const pages = ['/', '/404', '/tours'];
    expect(sitemapFailures(['/north-tours-web/', '/north-tours-web/tours/'], pages, preview)).toEqual([]);
    expect(sitemapFailures(['/', '/tours'], pages, preview)).toHaveLength(4);
  });

  it('reads a page’s title, to know a live 404 page is the built one', () => {
    expect(htmlTitle('<html><head><title>Page not found | North</title></head></html>')).toBe('Page not found | North');
    expect(htmlTitle('<html><head></head></html>')).toBeNull();
  });
});

describe('the audit’s table', () => {
  it('has a row per page, then each failure and warning', () => {
    const verdicts = judgeSite(
      [
        audit({ ...at('/'), vitals: { lcp: 2400, cls: 0.004, tbt: 250 }, runs: 1 }),
        audit({
          page: '/tours',
          facts: [facts(390, { title: 'Tours | North 2', h1s: 2 }), facts(1440, { title: 'Tours | North 2' })],
          vitals: { lcp: 2700, cls: 0, tbt: 120 },
          runs: 3,
          violations: [{ width: 1440, rule: 'region', targets: ['footer'] }],
        }),
        audit({ ...at('/help', { title: 'Help | North' }), vitals: null }),
      ],
      site,
    );
    expect(auditReport(verdicts)).toBe(
      [
        [
          '| Page | LCP | CLS | TBT | Axe violations | Page checks | Result |',
          '|---|---|---|---|---|---|---|',
          '| / | 2.40 s | 0.004 | 250 ms | 0 | pass | pass, TBT warning |',
          '| /tours | 2.70 s (median of 3) | 0.000 | 120 ms | 1 | 1 failed | fail |',
          '| /help | – | – | – | 0 | pass | fail |',
        ].join('\n'),
        'Failures (4)\n- /tours: LCP 2.70 s is over 2.50 s\n- /tours: 1440px: axe region on footer\n- /tours: 390px: 2 <h1>s\n- /help: Lighthouse couldn’t measure the page',
        'Warnings (1)\n- /: TBT 250 ms is over 200 ms (the lab stand-in for INP)',
      ].join('\n\n'),
    );
  });
});
