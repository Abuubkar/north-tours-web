import { describe, expect, it } from 'vitest';
import {
  advanceAmount,
  askMessage,
  bookingTotal,
  clampTravellers,
  totalBreakdown,
  maxTravellers,
  reserveMessage,
  travellersText,
} from './booking.ts';

const prices = { twin: 145000, triple: 135000, quad: 127000 };

describe('bookingTotal and advanceAmount', () => {
  it('multiplies the room price by the travellers', () => {
    expect(bookingTotal(prices, 'twin', 2)).toBe(290000);
    expect(bookingTotal(prices, 'quad', 4)).toBe(508000);
    expect(bookingTotal(prices, 'triple', 1)).toBe(135000);
  });

  it('uses a date’s own prices when it has them', () => {
    expect(bookingTotal({ twin: 160000, triple: 150000, quad: 140000 }, 'twin', 2)).toBe(320000);
  });

  it('takes the advance as a percentage of the total, in whole rupees', () => {
    expect(advanceAmount(290000, 30)).toBe(87000);
    expect(advanceAmount(135000, 30)).toBe(40500);
    expect(advanceAmount(98333, 30)).toBe(29500);
    expect(advanceAmount(98335, 30)).toBe(29501);
  });
});

describe('maxTravellers and clampTravellers', () => {
  const departures = [{ seatsTotal: 12 }, { seatsTotal: 16 }];

  it('allows the chosen date’s seats left', () => {
    expect(maxTravellers({ seatsLeft: 3 }, departures)).toBe(3);
  });

  it('allows one on a sold-out date, for its waitlist', () => {
    expect(maxTravellers({ seatsLeft: 0 }, departures)).toBe(1);
  });

  it('allows the largest group size with no date chosen', () => {
    expect(maxTravellers(undefined, departures)).toBe(16);
    expect(maxTravellers(undefined, [])).toBe(1);
  });

  it('keeps travellers between 1 and the most allowed', () => {
    expect(clampTravellers(5, 3)).toBe(3);
    expect(clampTravellers(0, 3)).toBe(1);
    expect(clampTravellers(2, 16)).toBe(2);
  });
});

describe('totalBreakdown', () => {
  it('shows the travellers times the price', () => {
    expect(totalBreakdown(2, 145000)).toBe('2 × PKR 145,000');
  });
});

describe('travellersText', () => {
  it('uses the singular for one', () => {
    expect(travellersText(1)).toBe('1 traveller');
    expect(travellersText(2)).toBe('2 travellers');
  });
});

describe('reserveMessage', () => {
  const template =
    'Hi, I’d like to reserve {travellers} on {tour}, {dates}, {room} sharing. Total {total}; I’ll pay the {advancePercent}% advance of {advance}.';
  const reservation = {
    tour: 'Hunza & Skardu Grand',
    departure: { start: '2027-05-12', end: '2027-05-20' },
    travellers: 2,
    roomName: 'Twin',
    total: 290000,
    advancePercent: 30,
  };

  it('fills every token', () => {
    expect(reserveMessage(template, reservation)).toBe(
      'Hi, I’d like to reserve 2 travellers on Hunza & Skardu Grand, 12–20 May 2027, twin sharing. Total PKR 290,000; I’ll pay the 30% advance of PKR 87,000.',
    );
  });

  it('says "1 traveller" for one', () => {
    expect(reserveMessage(template, { ...reservation, travellers: 1, roomName: 'Triple', total: 135000 })).toBe(
      'Hi, I’d like to reserve 1 traveller on Hunza & Skardu Grand, 12–20 May 2027, triple sharing. Total PKR 135,000; I’ll pay the 30% advance of PKR 40,500.',
    );
  });
});

describe('askMessage', () => {
  const whatsapp = { tourMessage: 'Hi, I’m interested in {tour} on {date}.', generalMessage: 'Hi, I’d like to plan a trip north.' };

  it('names the tour and the date', () => {
    expect(askMessage(whatsapp, 'Hunza Express', { start: '2027-06-02' })).toBe('Hi, I’m interested in Hunza Express on 2 Jun 2027.');
  });

  it('falls back to the general message with no date left', () => {
    expect(askMessage(whatsapp, 'Hunza Express', undefined)).toBe('Hi, I’d like to plan a trip north.');
  });
});
