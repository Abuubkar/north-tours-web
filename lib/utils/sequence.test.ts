import { describe, expect, it } from 'vitest';
import { sequenceNumber } from './sequence.ts';

describe('sequenceNumber', () => {
  it('pads to two digits', () => {
    expect(sequenceNumber(3)).toBe('03');
    expect(sequenceNumber(12)).toBe('12');
  });
});
