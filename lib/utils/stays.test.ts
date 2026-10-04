import { describe, expect, it } from 'vitest';
import { nightsLabel } from './stays.ts';

describe('nightsLabel', () => {
  it('names one night', () => {
    expect(nightsLabel({ from: 1, to: 1 }, 'Islamabad')).toBe('Night 1 · Islamabad');
  });

  it('names a run of nights as a range', () => {
    expect(nightsLabel({ from: 3, to: 5 }, 'Hunza')).toBe('Nights 3–5 · Hunza');
  });
});
