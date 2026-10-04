import { describe, expect, it } from 'vitest';
import { auditReport, builtPages, judgeSite, median, medianVitals, overLimit, sitemapFailures, type PageAudit, type PageFacts } from './audit.ts';

const buildFiles = new Set(['/index.html', '/images/hunza/attabad-share.jpg']);

const facts = (width: number, change: Partial<PageFacts> = {}): PageFacts => ({
  width,
  h1s: 1,
  title: 'Tours | North',
  description: 'Every trip from Lahore.',
  ogImage: '/images/hunza/attabad-share.jpg',
  twitterImage: '/images/hunza/attabad-share.jpg',
  canonical: '/tours',
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
const at = (page: string, change: Partial<PageFacts> = {}) => ({ page, facts: [facts(1440, { canonical: page, ...change })] });

const judge = (change: Partial<PageAudit> = {}) => judgeSite([audit(change)], buildFiles)[0];

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
    const verdicts = judgeSite([audit(at('/')), audit(at('/tours')), audit(at('/help', { title: 'Help | North' }))], buildFiles);
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
  it('fails a page without a canonical URL, or with another page’s, but not the 404', () => {
    expect(judge({ facts: [facts(1440, { canonical: '' })] }).failures).toEqual(['1440px: no canonical URL']);
    expect(judge({ facts: [facts(1440, { canonical: 'https://example.pk/' })] }).failures).toEqual([
      '1440px: canonical URL https://example.pk/ isn’t this page',
    ]);
    expect(judge({ facts: [facts(1440, { canonical: 'https://example.pk/tours' })] }).failures).toEqual([]);
    expect(judge(at('/404', { canonical: '' })).failures).toEqual([]);
  });

  it('fails a page missing from the sitemap and a sitemap URL that isn’t a built page, leaving out the 404', () => {
    const pages = ['/', '/404', '/tours', '/help'];
    expect(sitemapFailures(['/', '/tours', '/help'], pages)).toEqual([]);
    expect(sitemapFailures(['https://example.pk/', 'https://example.pk/tours', 'https://example.pk/help'], pages)).toEqual([]);
    expect(sitemapFailures(['/', '/tours', '/plan'], pages)).toEqual([
      'The sitemap doesn’t list /help',
      'The sitemap lists /plan, which isn’t a built page',
    ]);
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
      buildFiles,
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
