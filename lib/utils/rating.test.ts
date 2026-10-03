import { describe, expect, it } from 'vitest';
import { formatReviewCount, formatScore, ratingLabel, ratingSummary, starsLabel, summaryText } from './rating.ts';

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

describe('ratingSummary', () => {
  it('weights each score by its count and adds up the counts', () => {
    expect(ratingSummary([{ score: 5, count: 3 }, { score: 4, count: 1 }])).toEqual({ score: 4.75, count: 4 });
  });

  it('leaves out a tour with no reviews', () => {
    expect(ratingSummary([{ score: 4.9, count: 10 }, { score: 1, count: 0 }])).toEqual({ score: 4.9, count: 10 });
  });

  it('is null with no reviews at all', () => {
    expect(ratingSummary([{ score: 4.5, count: 0 }])).toBeNull();
    expect(ratingSummary([])).toBeNull();
  });
});

describe('summaryText', () => {
  it('follows the score: "average · 699 reviews"', () => {
    expect(summaryText(699)).toBe('average · 699 reviews');
    expect(summaryText(1240)).toBe('average · 1,240 reviews');
  });

  it('uses the singular for one review', () => {
    expect(summaryText(1)).toBe('average · 1 review');
  });
});
