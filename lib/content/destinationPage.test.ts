import { describe, expect, it } from 'vitest';
import { destinationPageTitle, getDestinationPage } from './destinationPage.ts';

describe('getDestinationPage', () => {
  it('gives the page title from the copy template', () => {
    expect(destinationPageTitle('hunza')).toBe('Hunza tours from Lahore');
    expect(destinationPageTitle('fairy-meadows')).toBe('Fairy Meadows tours from Lahore');
  });

  it('finds the tours that visit, never stored on the destination', () => {
    expect(getDestinationPage('hunza').tours.map((t) => t.slug).sort()).toEqual(['hunza-express', 'hunza-skardu-grand']);
    expect(getDestinationPage('murree').tours.map((t) => t.slug)).toEqual(['murree-galiyat-weekend']);
  });

  it('shares the destination’s own photo', () => {
    const { destination, sharePhoto } = getDestinationPage('skardu');
    expect(sharePhoto).toBe(destination.image);
  });
});
