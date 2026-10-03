import { describe, expect, it } from 'vitest';
import { routes } from './routes.ts';

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
    ]).toEqual(['/', '/tours', '/plan', '/about', '/help', '/contact', '/privacy', '/terms']);
  });

  it('builds tour and destination URLs from a slug', () => {
    expect(routes.tour('hunza-skardu-grand')).toBe('/tours/hunza-skardu-grand');
    expect(routes.destination('hunza')).toBe('/destinations/hunza');
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
