import { describe, expect, it } from 'vitest';
import { answerForHash, categoryLinks } from './helpAnswers.ts';

describe('categoryLinks', () => {
  it('gives each category its count, named with the count in words', () => {
    const words = { one: '{count} answer', other: '{count} answers' };
    const categories = [
      { id: 'booking', title: 'Booking & payment', questions: [{ id: 'a', question: 'Q', answer: 'A' }, { id: 'b', question: 'Q', answer: 'A' }] },
      { id: 'safety', title: 'Safety', questions: [{ id: 'c', question: 'Q', answer: 'A' }] },
    ];
    expect(categoryLinks(categories, words)).toEqual([
      { id: 'booking', title: 'Booking & payment', count: 2, name: 'Booking & payment, 2 answers' },
      { id: 'safety', title: 'Safety', count: 1, name: 'Safety, 1 answer' },
    ]);
  });
});

const ids = ['refunds', 'altitude', 'advance'];

describe('answerForHash', () => {
  it('gives the answer a known id links to', () => {
    expect(answerForHash('#refunds', ids)).toBe('refunds');
    expect(answerForHash('#altitude', ids)).toBe('altitude');
  });

  it('gives none for an unknown id, a category, the policies or no hash', () => {
    expect(answerForHash('#visa', ids)).toBeNull();
    expect(answerForHash('#cat-booking', ids)).toBeNull();
    expect(answerForHash('#policies', ids)).toBeNull();
    expect(answerForHash('', ids)).toBeNull();
    expect(answerForHash('#', ids)).toBeNull();
  });

  it('matches the id exactly: no other case or extra text', () => {
    expect(answerForHash('#Refunds', ids)).toBeNull();
    expect(answerForHash('#refunds-x', ids)).toBeNull();
    expect(answerForHash('refunds', ids)).toBeNull();
  });
});
