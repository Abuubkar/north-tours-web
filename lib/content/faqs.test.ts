import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fillTokens, textTokens } from '../utils/tokens.ts';
import { faqsFile, getFaqs, loadFaqs, tourPageFaqs, type Faqs } from './faqs.ts';
import { getSettings } from './settings.ts';
import { changedSettings, contentFixture, staleFigures } from './testing.ts';

const faqs: Faqs = JSON.parse(readFileSync(faqsFile(), 'utf8'));

function withChange(change: (copy: Faqs) => void) {
  const copy = structuredClone(faqs);
  change(copy);
  return loadFaqs(contentFixture({ 'faqs.json': copy }));
}

const fields = (result: ReturnType<typeof loadFaqs>) => result.problems.map((p) => p.field);

const allAnswers = (settings = getSettings()) =>
  getFaqs()
    .categories.flatMap((c) => c.questions)
    .map((q) => fillTokens(q.answer, textTokens(settings)))
    .join('\n');

describe('shared FAQs', () => {
  it('accepts the live file: Help’s six categories, in order', () => {
    expect(loadFaqs().problems).toEqual([]);
    expect(faqs.categories.map((c) => c.title)).toEqual([
      'Booking & payment',
      'Cancellations & changes',
      'On the trip',
      'Families & children',
      'Private & corporate trips',
      'Safety',
    ]);
  });

  it('rejects a missing answer, naming the file', () => {
    const result = withChange((c) => delete (c.categories[0].questions[0] as Partial<Faqs['categories'][number]['questions'][number]>).answer);
    expect(fields(result)).toEqual(['categories.0.questions.0.answer']);
    expect(result.problems[0].file).toMatch(/faqs\.json$/);
  });

  it('takes the policy and contact tokens, and no others', () => {
    const ok = withChange((c) =>
      Object.assign(c.categories[0].questions[0], {
        answer: '{refundSchedule} Paid back within {refundPaidWithinDays} days; we reply {replyTime}, {officeHours}. Support: {travelSupport}.',
      }),
    );
    expect(ok.problems).toEqual([]);
    const result = withChange((c) => Object.assign(c.categories[0].questions[0], { answer: 'Email {email}.' }));
    expect(fields(result)).toEqual(['categories.0.questions.0.answer']);
    expect(result.problems[0].message).toMatch(/^Unknown token \{email\}/);
  });

  it('rejects a question id used twice, even in another category', () => {
    const result = withChange((c) => Object.assign(c.categories[5].questions[0], { id: c.categories[0].questions[0].id }));
    expect(fields(result)).toEqual(['categories.5.questions.0.id']);
    expect(result.problems[0].message).toMatch(/used twice/);
  });

  it('rejects a question id that isn’t a slug or clashes with the Help page’s anchors', () => {
    for (const id of ['Refunds', 'main', 'policies', 'cat-safety']) {
      expect(fields(withChange((c) => Object.assign(c.categories[0].questions[0], { id })))).toEqual(['categories.0.questions.0.id']);
    }
  });

  it('rejects a category id used twice, and an empty category', () => {
    expect(fields(withChange((c) => Object.assign(c.categories[1], { id: 'booking' })))).toEqual(['categories.1.id']);
    expect(fields(withChange((c) => Object.assign(c.categories[1], { questions: [] })))).toEqual(['categories.1.questions']);
  });

  it('accepts sample and tourPages only as true', () => {
    expect(fields(withChange((c) => Object.assign(c.categories[0].questions[0], { sample: false })))).toEqual(['categories.0.questions.0.sample']);
    expect(fields(withChange((c) => Object.assign(c.categories[0].questions[0], { tourPages: 'yes' })))).toEqual([
      'categories.0.questions.0.tourPages',
    ]);
  });

  it('gives tour pages the same booking questions, in the same order, as before (#55)', () => {
    expect(tourPageFaqs(getFaqs()).map(({ question, answer }) => ({ question, answer }))).toEqual([
      {
        question: 'How do payment and the advance work?',
        answer:
          'Pay a {advancePercent}% advance to confirm your seats, by {paymentMethods}. The balance is due {balanceDueDays} days before departure. You get a receipt on WhatsApp for every payment.',
      },
      {
        question: 'What is the cancellation and refund policy?',
        answer: '{refundSchedule} If we cancel a departure, you get a full refund or a free move to another date.',
      },
      {
        question: 'Can we travel with children?',
        answer:
          'Yes. Children aged {childFromAge} and over count as travellers; younger children share their parents’ room free. Tell us their ages when you book and we’ll plan the stops around them.',
      },
    ]);
  });

  it('marks the tour pages’ answers taken from design copy as sample (ADR-0019)', () => {
    for (const question of tourPageFaqs(getFaqs())) expect(question.sample).toBe(true);
  });

  it('reads the payments as "cash or bank transfer" and the advance from settings', () => {
    const answers = allAnswers();
    expect(answers).toContain('by cash or bank transfer');
    expect(answers).toContain(`Pay a ${getSettings().booking.advancePercent}% advance`);
    expect(answers).not.toMatch(/JazzCash|Easypaisa|card/i);
  });

  it('shows changed settings in every answer, and none of the old figures', () => {
    const live = getSettings();
    const changed = changedSettings(live);
    const answers = allAnswers(changed);
    expect(staleFigures(answers, live, changed)).toEqual([]);
    expect(answers).toContain('Pay a 40% advance');
    expect(answers).toContain('up to 21 days before departure');
    expect(answers).toContain('Children under 3');
    expect(answers).toContain('We reply within 4 hours');
  });
});
