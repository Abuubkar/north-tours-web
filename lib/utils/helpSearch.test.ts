import { describe, expect, it } from 'vitest';
import { highlight, matchesAnswer, matchingAnswers, matchingCategories, normalise, resultLine, searchTerms } from './helpSearch.ts';

describe('normalise', () => {
  it('lower-cases and removes accents', () => {
    expect(normalise('REFUND')).toBe('refund');
    expect(normalise('Café')).toBe('cafe');
    expect(normalise('réfund')).toBe('refund');
  });

  it('turns punctuation and curly quotes into spaces, and collapses spaces', () => {
    expect(normalise('“Refunds”, please!')).toBe('refunds please');
    expect(normalise('parents’ room')).toBe('parents room');
    expect(normalise('  child   price  ')).toBe('child price');
  });
});

describe('searchTerms', () => {
  it('splits the query into folded words, ignoring words under 2 characters', () => {
    expect(searchTerms('Child price')).toEqual(['child', 'price']);
    expect(searchTerms('a refund & x')).toEqual(['refund']);
    expect(searchTerms('   ')).toEqual([]);
  });
});

const refunds = {
  question: 'What is the cancellation and refund policy?',
  answer: 'Cancel 14 or more days before departure for a full refund of your advance.',
};
const children = {
  question: 'Do children pay less?',
  answer: 'Children under 5 travel free when they share their parents’ room.',
};

describe('matchesAnswer', () => {
  it('matches one term in the question or the answer, as part of a word', () => {
    expect(matchesAnswer(refunds, ['refund'])).toBe(true);
    expect(matchesAnswer(refunds, ['departure'])).toBe(true);
    expect(matchesAnswer(refunds, ['cancel'])).toBe(true);
    expect(matchesAnswer({ question: 'Refunds', answer: '' }, ['refund'])).toBe(true);
  });

  it('needs every term, which may come from the question and the answer', () => {
    expect(matchesAnswer(children, ['children', 'room'])).toBe(true);
    expect(matchesAnswer(children, ['child', 'price'])).toBe(false);
    expect(matchesAnswer({ ...children, answer: 'The child price is half.' }, searchTerms('child price'))).toBe(true);
  });

  it('matches everything with no terms, terms under 2 characters ignored', () => {
    expect(matchesAnswer(refunds, [])).toBe(true);
    expect(matchesAnswer(refunds, searchTerms('a'))).toBe(true);
  });

  it('matches nothing for a word that isn’t there', () => {
    expect(matchesAnswer(refunds, ['visa'])).toBe(false);
  });
});

describe('highlight', () => {
  it('marks each match in place', () => {
    expect(highlight('Full refund of the refundable advance', ['refund'])).toEqual([
      { text: 'Full ', mark: false },
      { text: 'refund', mark: true },
      { text: ' of the ', mark: false },
      { text: 'refund', mark: true },
      { text: 'able advance', mark: false },
    ]);
  });

  it('keeps the original case and accents', () => {
    expect(highlight('Café and REFUNDS', ['cafe', 'refund'])).toEqual([
      { text: 'Café', mark: true },
      { text: ' and ', mark: false },
      { text: 'REFUND', mark: true },
      { text: 'S', mark: false },
    ]);
    expect(highlight('Réfund', searchTerms('refund'))).toEqual([{ text: 'Réfund', mark: true }]);
  });

  it('marks two terms, and joins overlapping ones into one mark', () => {
    expect(highlight('Children share a room', ['children', 'room'])).toEqual([
      { text: 'Children', mark: true },
      { text: ' share a ', mark: false },
      { text: 'room', mark: true },
    ]);
    expect(highlight('refunded', ['refund', 'funded'])).toEqual([{ text: 'refunded', mark: true }]);
  });

  it('marks nothing with no terms', () => {
    expect(highlight('Refunds', [])).toEqual([{ text: 'Refunds', mark: false }]);
    expect(highlight('', ['refund'])).toEqual([{ text: '', mark: false }]);
  });
});

const categories = [
  { id: 'booking', title: 'Booking', questions: [{ id: 'advance', question: 'How much is the advance?', answer: 'A 30% advance holds your seats.' }] },
  {
    id: 'cancellations',
    title: 'Cancellations',
    questions: [
      { id: 'refunds', ...refunds },
      { id: 'change-dates', question: 'Can I change my dates?', answer: 'Yes, free of charge.' },
    ],
  },
];

describe('matchingAnswers and matchingCategories', () => {
  it('keeps each category’s matches during a search, and leaves out categories with none', () => {
    const matching = matchingAnswers(categories, ['advance']);
    expect([...matching]).toEqual(['advance', 'refunds']);
    expect(matchingCategories(categories, matching).map((c) => [c.id, c.questions.map((q) => q.id)])).toEqual([
      ['booking', ['advance']],
      ['cancellations', ['refunds']],
    ]);
    expect(matchingCategories(categories, matchingAnswers(categories, ['dates'])).map((c) => c.id)).toEqual(['cancellations']);
  });

  it('keeps every category outside a search, and none for no match', () => {
    expect(matchingCategories(categories, null)).toEqual(categories);
    expect(matchingCategories(categories, matchingAnswers(categories, ['visa']))).toEqual([]);
  });
});

describe('resultLine', () => {
  const words = { many: '{count} answers for “{query}”', one: '1 answer for “{query}”', none: 'No answers for “{query}”' };

  it('says how many answers match, the query quoted as typed', () => {
    expect(resultLine(words, 3, 'refund')).toBe('3 answers for “refund”');
    expect(resultLine(words, 1, 'Altitude')).toBe('1 answer for “Altitude”');
    expect(resultLine(words, 0, ' visa ')).toBe('No answers for “visa”');
  });
});
