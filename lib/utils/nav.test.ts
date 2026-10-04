import { describe, expect, it } from 'vitest';
import { routes } from '../routes.ts';
import { activeNavItem, mainNav } from './nav.ts';

describe('mainNav', () => {
  it('lists the six pages in order, Home first', () => {
    expect(mainNav.map(({ label, href }) => [label, href])).toEqual([
      ['Home', '/'],
      ['Tours', '/tours'],
      ['Destinations', '/destinations'],
      ['Private trips', '/plan'],
      ['About', '/about'],
      ['Contact', '/contact'],
    ]);
  });

  it('links only to pages in the route map, never to a section', () => {
    const pages: string[] = Object.values(routes).filter((route) => typeof route === 'string');
    for (const { href } of mainNav) {
      expect(href).not.toContain('#');
      expect(pages).toContain(href);
    }
  });
});

describe('activeNavItem', () => {
  it.each([
    ['/', 'home'],
    ['/tours', 'tours'],
    ['/tours/hunza-skardu-grand', 'tours'],
    ['/destinations', 'destinations'],
    ['/destinations/hunza', 'destinations'],
    ['/plan', 'plan'],
    ['/about', 'about'],
    ['/contact', 'contact'],
  ])('marks %s as %s', (path, item) => {
    expect(activeNavItem(path)).toBe(item);
  });

  it.each(['/help', '/privacy', '/terms', '/credits', '/no-such-page'])('marks nothing on %s', (path) => {
    expect(activeNavItem(path)).toBeNull();
  });

  it('ignores a trailing slash', () => {
    expect(activeNavItem('/tours/')).toBe('tours');
    expect(activeNavItem('/destinations/')).toBe('destinations');
    expect(activeNavItem('/destinations/hunza/')).toBe('destinations');
    expect(activeNavItem('/plan/')).toBe('plan');
    expect(activeNavItem('/about/')).toBe('about');
    expect(activeNavItem('/contact/')).toBe('contact');
    expect(activeNavItem('/help/')).toBeNull();
  });

  it('marks Home on the Homepage only, never on a page under it', () => {
    for (const path of ['/tours', '/help', '/credits', '/no-such-page']) expect(activeNavItem(path)).not.toBe('home');
  });

  it('does not match a page that only starts with the same letters', () => {
    expect(activeNavItem('/tours-archive')).toBeNull();
    expect(activeNavItem('/destinations-old')).toBeNull();
    expect(activeNavItem('/planner')).toBeNull();
  });
});
