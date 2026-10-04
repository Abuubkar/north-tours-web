import { describe, expect, it } from 'vitest';
import { formatPkr } from './price.ts';

describe('formatPkr', () => {
  it('groups thousands', () => {
    expect(formatPkr(145000)).toBe('PKR 145,000');
    expect(formatPkr(38000)).toBe('PKR 38,000');
    expect(formatPkr(1250000)).toBe('PKR 1,250,000');
  });
});
