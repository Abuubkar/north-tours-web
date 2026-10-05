import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { BASE_PATH, sitePath } from './basePath.ts';

const BASE = '/north-tours-web';

describe('sitePath', () => {
  it('leaves every path as it is with no base path, as local builds have', () => {
    expect(BASE_PATH).toBe('');
    for (const path of ['/', '/tours', '/tours?dest=hunza', '/help#refunds', '/images/hunza/attabad-800.jpg', '/sitemap.xml']) {
      expect(sitePath(path)).toBe(path);
    }
  });

  it('puts a page under the base path as a folder, ending in "/"', () => {
    expect(sitePath('/', BASE)).toBe('/north-tours-web/');
    expect(sitePath('/tours', BASE)).toBe('/north-tours-web/tours/');
    expect(sitePath('/tours/hunza-express', BASE)).toBe('/north-tours-web/tours/hunza-express/');
    expect(sitePath('/tours/', BASE)).toBe('/north-tours-web/tours/');
  });

  it('keeps a query and an anchor after the page’s "/"', () => {
    expect(sitePath('/tours?dest=hunza&type=family', BASE)).toBe('/north-tours-web/tours/?dest=hunza&type=family');
    expect(sitePath('/help#refunds', BASE)).toBe('/north-tours-web/help/#refunds');
    expect(sitePath('/plan?dest=hunza#top', BASE)).toBe('/north-tours-web/plan/?dest=hunza#top');
  });

  it('puts a file under the base path without a trailing "/"', () => {
    expect(sitePath('/images/hunza/attabad-800.webp', BASE)).toBe('/north-tours-web/images/hunza/attabad-800.webp');
    expect(sitePath('/sitemap.xml', BASE)).toBe('/north-tours-web/sitemap.xml');
  });
});

describe('a build with BASE_PATH set', () => {
  // The base path is read once, when the modules load, as in a build: load them afresh with it set.
  let site: {
    routes: typeof import('../routes.ts')['routes'];
    nav: typeof import('./nav.ts');
    images: typeof import('./images.ts');
    metadata: typeof import('./metadata.ts');
    sitemap: typeof import('./sitemap.ts');
  };

  beforeAll(async () => {
    vi.stubEnv('BASE_PATH', BASE);
    vi.resetModules();
    site = {
      routes: (await import('../routes.ts')).routes,
      nav: await import('./nav.ts'),
      images: await import('./images.ts'),
      metadata: await import('./metadata.ts'),
      sitemap: await import('./sitemap.ts'),
    };
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('builds every route under it', () => {
    const { routes } = site;
    expect(routes.home).toBe('/north-tours-web/');
    expect(routes.tour('hunza-express')).toBe('/north-tours-web/tours/hunza-express/');
    expect(routes.toursWith({ dest: ['hunza'] })).toBe('/north-tours-web/tours/?dest=hunza');
    expect(routes.planFor('hunza')).toBe('/north-tours-web/plan/?dest=hunza');
    expect(routes.helpAnswer('refunds')).toBe('/north-tours-web/help/#refunds');
    expect(routes.guide('karim-baig')).toBe('/north-tours-web/about/#guide-karim-baig');
  });

  it('builds image and share-image URLs under it, and leaves the files’ names alone', () => {
    const photo = { src: '/images/a.jpg', width: 900 };
    expect(site.images.variantSrcSet(photo, 'webp')).toBe('/north-tours-web/images/a-480.webp 480w, /north-tours-web/images/a-800.webp 800w');
    expect(site.images.fallbackSrc(photo)).toBe('/north-tours-web/images/a-800.jpg');
    expect(site.images.variantSrc(photo.src, 800, 'jpg')).toBe('/images/a-800.jpg');
    expect(site.metadata.shareImageUrl(photo.src, '[Site URL]')).toBe('/north-tours-web/images/a-share.jpg');
  });

  it('lists the sitemap under it', () => {
    const urls = site.sitemap.sitemapUrls({ tours: ['hunza-express'], destinations: [] }, '[Site URL]');
    expect(urls[0]).toBe('/north-tours-web/');
    expect(urls).toContain('/north-tours-web/tours/hunza-express/');
  });

  it('marks the nav item from Next’s pathname, which has no base path', () => {
    const { activeNavItem } = site.nav;
    expect(activeNavItem('/')).toBe('home');
    expect(activeNavItem('/tours')).toBe('tours');
    expect(activeNavItem('/tours/')).toBe('tours');
    expect(activeNavItem('/tours/hunza-express')).toBe('tours');
    expect(activeNavItem('/destinations/hunza/')).toBe('destinations');
    expect(activeNavItem('/help')).toBeNull();
  });
});
