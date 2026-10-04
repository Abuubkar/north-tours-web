import { describe, expect, it } from 'vitest';
import { headlineSize } from './headline.ts';

describe('headlineSize', () => {
  it('keeps the standard size up to 44 characters', () => {
    expect(headlineSize('A green valley under the highest peaks')).toBe('standard');
    expect(headlineSize('a'.repeat(44))).toBe('standard');
  });

  it('takes the long size past 44 characters', () => {
    expect(headlineSize('a'.repeat(45))).toBe('long');
    expect(headlineSize('Cold desert and glacial lakes at the end of the Indus road')).toBe('long');
  });
});
