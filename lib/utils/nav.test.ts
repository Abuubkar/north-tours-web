import { describe, expect, it } from 'vitest';
import { activeNavItem, mainNav, sectionInView } from './nav.ts';

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

describe('sectionInView', () => {
  const viewport = 1000;
  /** Sections spaced like the Homepage's, with How it works' top at `how`. */
  const at = (how: number) => [
    { id: 'how', top: how },
    { id: 'destinations', top: how + 1500 },
    { id: 'reviews', top: how + 3000 },
  ];

  it('marks a section once its top is above 40% of the viewport, not before', () => {
    expect(sectionInView(at(399), viewport)).toBe('how');
    expect(sectionInView(at(400), viewport)).toBeNull();
    expect(sectionInView(at(401), viewport)).toBeNull();
  });

  it('marks nothing above How booking works', () => {
    expect(sectionInView(at(2000), viewport)).toBeNull();
  });

  it('marks the later of two sections past the line', () => {
    expect(sectionInView(at(-1200), viewport)).toBe('destinations');
  });

  it('marks Reviews at the bottom of the page', () => {
    expect(sectionInView(at(-3200), viewport)).toBe('reviews');
  });

  it('takes another line, e.g. 50% for the itinerary', () => {
    expect(sectionInView(at(450), viewport, 0.5)).toBe('how');
    expect(sectionInView(at(500), viewport, 0.5)).toBeNull();
  });
});
