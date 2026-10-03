import { describe, expect, it } from 'vitest';
import { activeNavItem, mainNav } from './nav.ts';

describe('activeNavItem', () => {
  it.each([
    ['/tours', 'tours'],
    ['/tours/hunza-skardu-grand', 'tours'],
    ['/destinations/hunza', 'destinations'],
    ['/about', 'guides'],
    ['/', null],
    ['/help', null],
  ])('maps %s to %s', (path, item) => {
    expect(activeNavItem(path)).toBe(item);
  });

  it('ignores a trailing slash', () => {
    expect(activeNavItem('/tours/')).toBe('tours');
    expect(activeNavItem('/about/')).toBe('guides');
  });

  it('does not match a page that only starts with the same letters', () => {
    expect(activeNavItem('/tours-archive')).toBeNull();
  });
});

describe('mainNav', () => {
  it('lists the five items in order, from the route map', () => {
    expect(mainNav.map(({ label, href }) => [label, href])).toEqual([
      ['Tours', '/tours'],
      ['How it works', '/#how'],
      ['Destinations', '/#destinations'],
      ['Guides', '/about#guides'],
      ['Reviews', '/#reviews'],
    ]);
  });
});
