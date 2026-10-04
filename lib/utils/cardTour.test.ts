import { describe, expect, it } from 'vitest';
import { getTour } from '../content/catalog.ts';
import { cardTour } from './cardTour.ts';

describe('cardTour', () => {
  it('keeps what a card and its list use, and leaves the page-only content out', () => {
    const card = cardTour(getTour('hunza-skardu-grand')!);
    expect(Object.keys(card).sort()).toEqual(
      ['days', 'departures', 'destinations', 'image', 'nights', 'prices', 'rating', 'route', 'slug', 'title', 'tripTypes'].sort(),
    );
  });
});
