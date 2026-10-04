import { describe, expect, it } from 'vitest';
import type { Departure } from '../content/tours.ts';
import { destinationReviews, destinationSections, tourCards, toursVisiting } from './destination.ts';
import { tripsCount } from './resultsText.ts';

const tour = (title: string, destinations: string[]) => ({ title, destinations });
const grand = tour('Hunza & Skardu Grand', ['hunza', 'skardu']);
const express = tour('Hunza Express', ['hunza']);
const swat = tour('Swat Family Escape', ['swat']);

describe('toursVisiting', () => {
  it('finds every tour that names the destination, in order', () => {
    expect(toursVisiting('hunza', [grand, swat, express])).toEqual([grand, express]);
  });

  it('counts a tour visiting two destinations for both', () => {
    expect(toursVisiting('skardu', [grand, express])).toEqual([grand]);
    expect(toursVisiting('hunza', [grand, express])).toEqual([grand, express]);
  });

  it('is empty when no tour visits', () => {
    expect(toursVisiting('murree', [grand, express, swat])).toEqual([]);
  });
});

describe('destinationSections', () => {
  const place = {
    id: 'baltit-fort',
    name: 'Baltit Fort',
    kind: 'heritage' as const,
    text: 'The centuries-old fort above Karimabad.',
    lat: 36.3275,
    lon: 74.6696,
    image: { placeholder: 'Baltit Fort', alt: 'Baltit Fort' },
  };
  const note = { title: 'Cash and ATMs', text: 'Carry enough cash.' };

  const tour = { title: 'Hunza Express' };
  const review = { tour: 'hunza-express', month: '2026-05' };
  const sections = (destination: Parameters<typeof destinationSections>[0]['destination'], tours: unknown[] = [tour], reviews: unknown[] = [review]) =>
    destinationSections({ destination, tours, reviews });

  it('shows every section with places, notes and tours (Hunza)', () => {
    expect(sections({ places: [place], notes: [note] })).toEqual([
      'hero',
      'overview',
      'calendar',
      'places',
      'gettingThere',
      'goodToKnow',
      'tours',
      'banner',
      'reviews',
      'others',
    ]);
  });

  it('leaves out places and good to know with none (Murree), keeping the sections every page has', () => {
    const murree = ['hero', 'overview', 'calendar', 'gettingThere', 'tours', 'banner', 'reviews', 'others'];
    expect(sections({})).toEqual(murree);
    expect(sections({ places: [], notes: [] })).toEqual(murree);
  });

  it('leaves the tours and reviews out with none, keeping the banner and other destinations', () => {
    expect(sections({}, [], [])).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'banner', 'others']);
    expect(sections({}, [tour], [])).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'tours', 'banner', 'others']);
  });

  it('shows each optional section on its own', () => {
    expect(sections({ places: [place] }, [], [])).toEqual(['hero', 'overview', 'calendar', 'places', 'gettingThere', 'banner', 'others']);
    expect(sections({ notes: [note] }, [], [])).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'goodToKnow', 'banner', 'others']);
  });
});

describe('tourCards', () => {
  const departure = (start: string, seatsLeft: number): Departure => ({ start, end: start, seatsTotal: 16, seatsLeft });
  const listed = (title: string, destinations: string[], departures: Departure[]) => ({
    title,
    destinations,
    tripTypes: ['family' as const],
    days: 1,
    prices: { twin: 50000, triple: 45000, quad: 40000 },
    departures,
  });
  const today = '2027-05-01';
  const grand = listed('Hunza & Skardu Grand', ['hunza', 'skardu'], [departure('2027-05-12', 0), departure('2027-06-09', 5)]);
  const express = listed('Hunza Express', ['hunza'], [departure('2027-05-20', 3)]);
  const full = listed('Hunza Autumn', ['hunza'], [departure('2027-05-05', 0)]);
  const none = listed('Hunza Winter', ['hunza'], [departure('2027-01-05', 4)]);

  it('orders bookable, then sold out, then no upcoming dates; soonest first', () => {
    const cards = tourCards(toursVisiting('hunza', [none, full, grand, express]), today);
    expect(cards.map((c) => c.tour.title)).toEqual(['Hunza Express', 'Hunza & Skardu Grand', 'Hunza Autumn', 'Hunza Winter']);
  });

  it('shows each card’s next date with seats, the next sold-out one when all are full, and none when nothing is left', () => {
    const cards = tourCards([grand, full, none], today);
    expect(cards.map((c) => c.departure?.start)).toEqual(['2027-06-09', '2027-05-05', undefined]);
  });

  it('drops a departure that has left, moving the card on', () => {
    expect(tourCards([express], '2027-05-21')[0].departure).toBeUndefined();
    expect(tourCards([grand], '2027-05-13')[0].departure?.start).toBe('2027-06-09');
  });

  it('puts a tour visiting two destinations on both', () => {
    expect(tourCards(toursVisiting('skardu', [grand, express]), today).map((c) => c.tour.title)).toEqual(['Hunza & Skardu Grand']);
  });
});

describe('destinationReviews', () => {
  const review = (tour: string, month: string) => ({ tour, month });
  const reviews = [
    review('hunza-express', '2026-05'),
    review('hunza-skardu-grand', '2026-08'),
    review('swat-family-escape', '2026-09'),
    review('hunza-skardu-grand', '2026-06'),
    review('hunza-express', '2026-07'),
  ];

  it('takes reviews across the destination’s tours, most recent first, at most three', () => {
    expect(destinationReviews(reviews, ['hunza-express', 'hunza-skardu-grand'])).toEqual([
      review('hunza-skardu-grand', '2026-08'),
      review('hunza-express', '2026-07'),
      review('hunza-skardu-grand', '2026-06'),
    ]);
  });

  it('counts a review of a two-destination tour for both', () => {
    expect(destinationReviews(reviews, ['hunza-skardu-grand'])).toHaveLength(2);
    expect(destinationReviews([review('hunza-skardu-grand', '2026-08')], ['skardu-deosai', 'hunza-skardu-grand'])).toHaveLength(1);
  });

  it('is empty when no tour of the destination has reviews', () => {
    expect(destinationReviews(reviews, ['murree-galiyat-weekend'])).toEqual([]);
  });
});

describe('tour count words', () => {
  const words = { one: '{count} tour', other: '{count} tours' };

  it('says "1 tour" and "2 tours"', () => {
    expect(tripsCount(1, words)).toBe('1 tour');
    expect(tripsCount(2, words)).toBe('2 tours');
  });
});
