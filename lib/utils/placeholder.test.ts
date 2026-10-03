import { describe, expect, it } from 'vitest';
import { isPlaceholder } from './placeholder.ts';

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
