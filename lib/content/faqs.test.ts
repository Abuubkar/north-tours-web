import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { faqsFile, loadFaqs, type Faqs } from './faqs.ts';
import { contentFixture } from './testing.ts';

const faqs: Faqs = JSON.parse(readFileSync(faqsFile(), 'utf8'));

function withChange(change: (copy: Faqs) => void) {
  const copy = structuredClone(faqs);
  change(copy);
  return loadFaqs(contentFixture({ 'faqs.json': copy }));
}

const fields = (result: ReturnType<typeof loadFaqs>) => result.problems.map((p) => p.field);

describe('shared FAQs', () => {
  it('accepts the live file, with a booking category', () => {
    expect(loadFaqs().problems).toEqual([]);
    expect(faqs.categories.map((c) => c.id)).toContain('booking');
  });

  it('rejects a missing answer, naming the file', () => {
    const result = withChange((c) => delete (c.categories[0].questions[0] as Partial<Faqs['categories'][number]['questions'][number]>).answer);
    expect(fields(result)).toEqual(['categories.0.questions.0.answer']);
    expect(result.problems[0].file).toMatch(/faqs\.json$/);
  });

  it('takes the policy tokens, and no others', () => {
    expect(withChange((c) => Object.assign(c.categories[0].questions[0], { answer: '{refundSchedule} Balance {balanceDueDays} days.' })).problems).toEqual([]);
    const result = withChange((c) => Object.assign(c.categories[0].questions[0], { answer: 'Meet at {pickupPoint}.' }));
    expect(fields(result)).toEqual(['categories.0.questions.0.answer']);
    expect(result.problems[0].message).toMatch(/^Unknown token \{pickupPoint\}/);
  });
});
