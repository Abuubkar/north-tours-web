import { describe, expect, it } from 'vitest';
import { destinationPageTitle, getDestinationPage } from './destinationPage.ts';

describe('destination page', () => {
  it('gives the page title from the copy template', () => {
    expect(destinationPageTitle('hunza')).toBe('Hunza tours from Lahore');
    expect(destinationPageTitle('fairy-meadows')).toBe('Fairy Meadows tours from Lahore');
  });

  it('finds the tours that visit, never stored on the destination', () => {
    expect(getDestinationPage('hunza').tours.map((t) => t.slug).sort()).toEqual(['hunza-express', 'hunza-skardu-grand']);
    expect(getDestinationPage('murree').tours.map((t) => t.slug)).toEqual(['murree-galiyat-weekend']);
  });

  it('asks on WhatsApp about the destination', () => {
    expect(decodeURIComponent(getDestinationPage('hunza').askHref)).toContain('Hi, I’d like to plan a private trip to Hunza.');
  });

  it('shows the three most recent reviews of the tours that visit, and Murree its one', () => {
    const { reviews } = getDestinationPage('hunza');
    expect(reviews).toHaveLength(3);
    expect(reviews.map((r) => r.review.month)).toEqual([...reviews.map((r) => r.review.month)].sort().reverse());
    expect(getDestinationPage('murree').reviews.map((r) => r.tourTitle)).toEqual(['Murree & Galiyat Weekend']);
  });

  it('links to the other five destinations, each with its tours', () => {
    const { others } = getDestinationPage('hunza');
    expect(others.map((o) => o.slug)).toEqual(['fairy-meadows', 'murree', 'naran-kaghan', 'skardu', 'swat']);
    expect(others.find((o) => o.slug === 'skardu')!.tours).toBe('2 tours');
    expect(others.find((o) => o.slug === 'murree')!.tours).toBe('1 tour');
  });

  it('shares the destination’s own photo', () => {
    const { destination, sharePhoto } = getDestinationPage('skardu');
    expect(sharePhoto).toBe(destination.image);
  });
});
