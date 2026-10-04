import { describe, expect, it } from 'vitest';
import { sortedByText, tripsCount } from './resultsText.ts';

const words = { one: '{count} trip', other: '{count} trips' };

describe('tripsCount', () => {
  it.each([
    [0, '0 trips'],
    [1, '1 trip'],
    [8, '8 trips'],
  ])('%i is "%s"', (count, text) => {
    expect(tripsCount(count, words)).toBe(text);
  });
});

describe('sortedByText', () => {
  it('names the sort in lower case', () => {
    expect(sortedByText('Sorted by {sort} · sold-out trips last', 'Soonest departure')).toBe(
      'Sorted by soonest departure · sold-out trips last',
    );
    expect(sortedByText('Sorted by {sort} · sold-out trips last', 'Price: low to high')).toBe(
      'Sorted by price: low to high · sold-out trips last',
    );
  });
});
