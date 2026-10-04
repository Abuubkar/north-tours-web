import { describe, expect, it } from 'vitest';
import { hasPlaceholder, isPlaceholder } from './placeholder.ts';

describe('isPlaceholder', () => {
  it.each(['[+92 3XX XXX XXXX]', '[Instagram URL]', '[hello@brand.pk]'])('is true for %s', (value) => {
    expect(isPlaceholder(value)).toBe(true);
  });

  it.each(['+92 300 1234567', 'hello@example.pk', 'https://instagram.com/example'])(
    'is false for the real value %s',
    (value) => {
      expect(isPlaceholder(value)).toBe(false);
    },
  );

  it('is false when only part of the value is in brackets', () => {
    expect(isPlaceholder('[Office address], Lahore, Punjab')).toBe(false);
  });
});

describe('hasPlaceholder', () => {
  it.each(['[Office address], Lahore, Punjab', '[Office address]', 'Shop 4, [Street], Lahore'])('is true for %s', (value) => {
    expect(hasPlaceholder(value)).toBe(true);
  });

  it.each(['12 Main Boulevard, Gulberg, Lahore', 'Mon–Sat, 10 am – 7 pm', '[]'])('is false for %s', (value) => {
    expect(hasPlaceholder(value)).toBe(false);
  });
});
