import { describe, expect, it } from 'vitest';
import { guideAnchor, guideHash, routes } from './routes.ts';

describe('routes', () => {
  it('has a URL for each page', () => {
    expect([
      routes.home,
      routes.tours,
      routes.plan,
      routes.about,
      routes.help,
      routes.contact,
      routes.privacy,
      routes.terms,
      routes.credits,
    ]).toEqual(['/', '/tours', '/plan', '/about', '/help', '/contact', '/privacy', '/terms', '/credits']);
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

  it('has the four nav anchors', () => {
    expect([routes.how, routes.destinations, routes.reviews, routes.guides]).toEqual([
      '/#how',
      '/#destinations',
      '/#reviews',
      '/about#guides',
    ]);
  });
});
