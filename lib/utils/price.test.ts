import { describe, expect, it } from 'vitest';
import type { Departure, RoomPrices } from '../content/tours.ts';
import { cardPrice, departurePrices, formatPkr, fromPrice, shownPrice } from './price.ts';

describe('formatPkr', () => {
  it('groups thousands', () => {
    expect(formatPkr(145000)).toBe('PKR 145,000');
    expect(formatPkr(38000)).toBe('PKR 38,000');
    expect(formatPkr(1250000)).toBe('PKR 1,250,000');
  });
});

const prices: RoomPrices = { twin: 145000, triple: 135000, quad: 127000 };
const eid: RoomPrices = { twin: 160000, triple: 150000, quad: 140000 };
const departure = (start: string, own?: RoomPrices): Departure => ({
  start,
  end: start,
  seatsTotal: 16,
  seatsLeft: 9,
  ...(own && { prices: own }),
});

describe('departurePrices', () => {
  it('is the tour’s set for a departure without its own', () => {
    expect(departurePrices({ prices }, departure('2027-05-12'))).toEqual(prices);
  });

  it('is the departure’s own set when it has one, replacing the whole set', () => {
    expect(departurePrices({ prices }, departure('2027-06-09', eid))).toEqual(eid);
  });
});

describe('fromPrice', () => {
  const today = '2027-05-01';

  it('is the lowest twin price across upcoming departures', () => {
    const cheaper = { ...eid, twin: 139000 };
    const tour = { prices, departures: [departure('2027-05-12', eid), departure('2027-06-09', cheaper)] };
    expect(fromPrice(tour, today)).toBe(139000);
  });

  it('is the tour’s twin price when its departures don’t change it', () => {
    expect(fromPrice({ prices, departures: [departure('2027-05-12'), departure('2027-06-09', eid)] }, today)).toBe(145000);
  });

  it('ignores a cheaper departure that has already left', () => {
    const tour = { prices, departures: [departure('2027-04-20', { ...prices, twin: 99000 }), departure('2027-05-12', eid)] };
    expect(fromPrice(tour, today)).toBe(160000);
  });

  it('gives way to the chosen date’s twin price in the booking (shownPrice)', () => {
    const tour = { prices, departures: [departure('2027-05-12'), departure('2027-06-09', eid)] };
    expect(shownPrice(tour, undefined, today)).toBe(145000);
    expect(shownPrice(tour, tour.departures[1], today)).toBe(160000);
  });

  it('falls back to the tour’s twin price with no departure left', () => {
    expect(fromPrice({ prices, departures: [departure('2027-04-20', eid)] }, today)).toBe(145000);
    expect(fromPrice({ prices, departures: [] }, today)).toBe(145000);
  });
});

describe('cardPrice', () => {
  const tour = { prices: { twin: 145000, triple: 135000, quad: 127000 } };

  it('is the twin price of the departure the card shows, its own if it has one', () => {
    expect(cardPrice(tour, {})).toBe(145000);
    expect(cardPrice(tour, { prices: { twin: 160000, triple: 150000, quad: 140000 } })).toBe(160000);
  });

  it('is the tour’s "from" price, its twin price, with no dates left', () => {
    expect(cardPrice(tour, undefined)).toBe(145000);
  });
});
