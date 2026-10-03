import { describe, expect, it } from 'vitest';
import { whatsappLink } from './whatsapp.ts';

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
