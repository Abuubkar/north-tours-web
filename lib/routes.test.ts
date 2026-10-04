import { describe, expect, it } from 'vitest';
import { guideAnchor, guideHash, helpCategoryAnchor, PAGE_NAMES, routes } from './routes.ts';

describe('routes', () => {
  it('has a URL for each page', () => {
    expect([
      routes.home,
      routes.tours,
      routes.destinations,
      routes.plan,
      routes.about,
      routes.help,
      routes.contact,
      routes.privacy,
      routes.terms,
      routes.credits,
    ]).toEqual(['/', '/tours', '/destinations', '/plan', '/about', '/help', '/contact', '/privacy', '/terms', '/credits']);
  });

  it('builds tour and destination URLs from a slug', () => {
    expect(routes.tour('hunza-skardu-grand')).toBe('/tours/hunza-skardu-grand');
    expect(routes.destination('hunza')).toBe('/destinations/hunza');
  });

  it('opens the Planner with a destination chosen', () => {
    expect(routes.planFor('hunza')).toBe('/plan?dest=hunza');
  });

  it('links a guide to their profile on the About page', () => {
    expect(routes.guide('karim-baig')).toBe('/about#guide-karim-baig');
    expect(guideAnchor('karim-baig')).toBe('guide-karim-baig');
    expect(guideHash('karim-baig')).toBe('#guide-karim-baig');
  });

  it('links to Help’s booking policies', () => {
    expect(routes.policies).toBe('/help#policies');
  });

  it('links to one answer on Help, and to a category’s heading', () => {
    expect(routes.helpAnswer('refunds')).toBe('/help#refunds');
    expect(helpCategoryAnchor('safety')).toBe('cat-safety');
  });

  it('links to About’s guides', () => {
    expect(routes.guides).toBe('/about#guides');
  });

  it('names every fixed page, not the ones built from a slug or filters', () => {
    expect(PAGE_NAMES).toEqual(expect.arrayContaining(['home', 'plan', 'destinations', 'policies']));
    expect(PAGE_NAMES).not.toContain('tour');
    expect(PAGE_NAMES).not.toContain('toursWith');
  });
});
