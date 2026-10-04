import { describe, expect, it } from 'vitest';
import { optionLabel, optionLabels, optionName, showTripsLabel, sortedByText, tripsCount, type OptionLabels } from './resultsText.ts';

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

describe('optionLabel', () => {
  const labels: OptionLabels = {
    dest: { hunza: 'Hunza', 'naran-kaghan': 'Naran-Kaghan' },
    dur: { '2-4': '2–4 days', '5-7': '5–7 days', '8plus': '8+ days' },
    budget: { 'under-50k': 'Under PKR 50k', '50-100k': 'PKR 50–100k', '100k-plus': 'PKR 100k+' },
    type: { family: 'Family', couples: 'Couples', friends: 'Friends', corporate: 'Corporate' },
  };

  it('names an option in its group’s words', () => {
    expect(optionLabel(labels, 'dest', 'naran-kaghan')).toBe('Naran-Kaghan');
    expect(optionLabel(labels, 'dur', '8plus')).toBe('8+ days');
    expect(optionLabel(labels, 'type', 'family')).toBe('Family');
  });

  it('names a month with its year', () => {
    expect(optionLabel(labels, 'month', '2027-06')).toBe('June 2027');
  });
});

describe('optionLabels', () => {
  it('names destinations by slug, beside the page’s labels', () => {
    const options = { dur: { '2-4': 'a', '5-7': 'b', '8plus': 'c' }, budget: { 'under-50k': 'd', '50-100k': 'e', '100k-plus': 'f' }, type: { family: 'g', couples: 'h', friends: 'i', corporate: 'j' } };
    const labels = optionLabels([{ slug: 'hunza', name: 'Hunza' }, { slug: 'swat', name: 'Swat' }], options);
    expect(labels.dest).toEqual({ hunza: 'Hunza', swat: 'Swat' });
    expect(optionLabel(labels, 'type', 'family')).toBe('g');
  });
});

describe('showTripsLabel', () => {
  const show = { one: 'Show {count} trip', other: 'Show {count} trips' };

  it.each([
    [0, 'No trips match'],
    [1, 'Show 1 trip'],
    [2, 'Show 2 trips'],
  ])('%i is "%s"', (count, label) => {
    expect(showTripsLabel(count, show, 'No trips match')).toBe(label);
  });
});

describe('optionName', () => {
  it('names an option with its count', () => {
    expect(optionName('Hunza', 3, words)).toBe('Hunza, 3 trips');
    expect(optionName('Murree', 1, words)).toBe('Murree, 1 trip');
  });
});
