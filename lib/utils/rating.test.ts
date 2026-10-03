import { describe, expect, it } from 'vitest';
import { formatReviewCount, formatScore, ratingLabel, starsLabel } from './rating';

describe('formatScore', () => {
  it('always shows one decimal', () => {
    expect(formatScore(4.9)).toBe('4.9');
    expect(formatScore(5)).toBe('5.0');
    expect(formatScore(4.86)).toBe('4.9');
  });
});

describe('formatReviewCount', () => {
  it('groups thousands', () => {
    expect(formatReviewCount(128)).toBe('128');
    expect(formatReviewCount(1240)).toBe('1,240');
  });
});

describe('ratingLabel', () => {
  it('reads as one phrase', () => {
    expect(ratingLabel(4.9, 128)).toBe('4.9 out of 5, 128 reviews');
  });

  it('uses the singular for one review', () => {
    expect(ratingLabel(5, 1)).toBe('5.0 out of 5, 1 review');
  });
});

describe('starsLabel', () => {
  it('names the stars out of five', () => {
    expect(starsLabel(4)).toBe('4 out of 5 stars');
  });
});
