import { describe, expect, it } from 'vitest';
import type { Tour } from '../content/tours.ts';
import { cardTour } from './cardTour.ts';

describe('cardTour', () => {
  it('leaves out what only the tour page shows', () => {
    const tour = { slug: 'hunza-express', title: 'Hunza Express', itinerary: [{ title: 'Day 1' }], faqs: [], stays: [], summary: 'Six days.' };
    const card = cardTour(tour as unknown as Tour);
    expect(card).toMatchObject({ slug: 'hunza-express', title: 'Hunza Express' });
    expect(card).not.toHaveProperty('itinerary');
    expect(card).not.toHaveProperty('faqs');
    expect(card).not.toHaveProperty('summary');
  });
});
