import { describe, expect, it } from 'vitest';
import { categoryLinks } from './helpAnswers.ts';

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
