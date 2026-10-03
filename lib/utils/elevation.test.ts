import { describe, expect, it } from 'vitest';
import { formatElevation } from './elevation.ts';

describe('formatElevation', () => {
  it('groups thousands and adds metres', () => {
    expect(formatElevation(2438)).toBe('2,438 m');
    expect(formatElevation(217)).toBe('217 m');
  });
});
