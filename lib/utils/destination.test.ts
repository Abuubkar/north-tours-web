import { describe, expect, it } from 'vitest';
import type { Departure } from '../content/tours.ts';
import { destinationSections, tourCards, toursVisiting } from './destination.ts';

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
  const sections = (destination: Parameters<typeof destinationSections>[0]['destination'], tours: unknown[] = [tour]) =>
    destinationSections({ destination, tours });

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
    ]);
  });

  it('leaves out places and good to know with none (Murree), keeping the sections every page has', () => {
    expect(sections({})).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'tours', 'banner']);
    expect(sections({ places: [], notes: [] })).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'tours', 'banner']);
  });

  it('leaves the tours out when no tour visits, keeping the banner', () => {
    expect(sections({}, [])).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'banner']);
  });

  it('shows each optional section on its own', () => {
    expect(sections({ places: [place] }, [])).toEqual(['hero', 'overview', 'calendar', 'places', 'gettingThere', 'banner']);
    expect(sections({ notes: [note] }, [])).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'goodToKnow', 'banner']);
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
