import { describe, expect, it } from 'vitest';
import { departureMessage, whatsappLink } from './whatsapp.ts';

describe('whatsappLink', () => {
  it('reduces a real number to its digits', () => {
    expect(whatsappLink('+92 300 1234567', 'Hi')).toBe('https://wa.me/923001234567?text=Hi');
  });

  it('leaves a placeholder number out', () => {
    expect(whatsappLink('[+92 3XX XXX XXXX]', 'Hi')).toBe('https://wa.me/?text=Hi');
  });

  it('encodes the message', () => {
    expect(whatsappLink('+92 300 1234567', 'Hi, I’d like to plan a trip north & back?')).toBe(
      'https://wa.me/923001234567?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north%20%26%20back%3F',
    );
  });
});

describe('departureMessage', () => {
  it('fills the tour message with the title and the start date with its year', () => {
    expect(departureMessage('Hi, I’m interested in {tour} on {date}.', 'Hunza & Skardu Grand', '2027-05-12')).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 12 May 2027.',
    );
  });

  it('fills the waitlist message the same way', () => {
    expect(
      departureMessage('Hi, please add me to the waitlist for {tour} on {date} in case a seat opens up.', 'Fairy Meadows Trek', '2027-06-14'),
    ).toBe('Hi, please add me to the waitlist for Fairy Meadows Trek on 14 Jun 2027 in case a seat opens up.');
  });
});
