import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getFaqs } from './faqs.ts';
import { getHelpPage, helpCategories, helpCtaLead, helpPolicies } from './helpPage.ts';
import { helpCopyFile, loadHelpCopy, type HelpCopy } from './pages.ts';
import { getSettings } from './settings.ts';
import { changedSettings, contentFixture, staleFigures } from './testing.ts';

const help: HelpCopy = JSON.parse(readFileSync(helpCopyFile(), 'utf8'));

function withChange(change: (copy: HelpCopy) => void) {
  const copy = structuredClone(help);
  change(copy);
  return loadHelpCopy(contentFixture({ 'pages/help.json': copy }));
}

describe('help page copy', () => {
  it('accepts the live file', () => {
    expect(loadHelpCopy().problems).toEqual([]);
  });

  it('rejects a missing field and a token a field can’t take', () => {
    expect(withChange((c) => delete (c.header as Partial<HelpCopy['header']>).headline).problems.map((p) => p.field)).toEqual(['header.headline']);
    const result = withChange((c) => Object.assign(c, { linkToAnswer: 'Link · {url}' }));
    expect(result.problems.map((p) => p.field)).toEqual(['linkToAnswer']);
    expect(result.problems[0].message).toMatch(/^Unknown token \{url\}/);
    const search = withChange((c) => Object.assign(c.search.results, { none: 'No {count} answers for “{query}”' }));
    expect(search.problems.map((p) => p.field)).toEqual(['search.results.none']);
    const empty = withChange((c) => Object.assign(c.empty, { lead: 'We reply {replyTime}, {officeHours}.' }));
    expect(empty.problems.map((p) => p.field)).toEqual(['empty.lead']);
  });
});

describe('helpCategories', () => {
  it('keeps every category and question in order, each answer’s tokens filled', () => {
    const categories = helpCategories(getFaqs(), getSettings());
    expect(categories.map((c) => c.id)).toEqual(getFaqs().categories.map((c) => c.id));
    const answers = categories.flatMap((c) => c.questions);
    expect(answers).toHaveLength(getFaqs().categories.flatMap((c) => c.questions).length);
    for (const { answer } of answers) expect(answer).not.toMatch(/\{\w+\}/);
  });
});

describe('getHelpPage', () => {
  it('fills the empty state’s reply time, and asks on WhatsApp with the general message', () => {
    const { copy, askHref, settings } = getHelpPage();
    expect(copy.empty.lead).toContain(settings.booking.replyTime);
    expect(askHref).toBe(`https://wa.me/923444430021?text=${encodeURIComponent(settings.whatsapp.generalMessage)}`);
  });

  it('marks up every question for search engines in page order, answers filled as shown', () => {
    const { categories, structuredData } = getHelpPage();
    const shown = categories.flatMap((category) => category.questions);
    const marked = structuredData.faqs.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(marked.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(shown.map((q) => [q.question, q.answer]));
    for (const { acceptedAnswer } of marked) expect(acceptedAnswer.text).not.toMatch(/\{\w+\}/);
  });
});

describe('helpPolicies', () => {
  it('fills every token, and gives the refund table only to the policies that show it', () => {
    const policies = helpPolicies(help, getSettings());
    expect(policies.map((p) => p.title)).toEqual([
      'Cancellation & refunds',
      'Changes to your booking',
      'Payments and the advance',
      'Children and room sharing',
      'Weather and road closures',
      'Safety on the trip',
    ]);
    expect(policies.filter((p) => p.refundRows).map((p) => p.id)).toEqual(['cancellation']);
    expect(policies[0].refundRows).toEqual([
      { days: '14 or more days', refund: '100%' },
      { days: '7–13 days', refund: '50%' },
      { days: 'Under 7 days', refund: 'None' },
    ]);
    for (const p of policies) expect([p.summary, ...p.paragraphs].join(' ')).not.toMatch(/\{\w+\}/);
  });

  it('marks every policy as sample text (ADR-0020)', () => {
    for (const item of help.policies.items) expect(item.sample).toBe(true);
  });

  it('shows changed settings in every policy and the closing lead, and none of the old figures', () => {
    const live = getSettings();
    const changed = changedSettings(live);
    const policies = helpPolicies(help, changed);
    const text = [
      ...policies.flatMap((p) => [p.summary, ...p.paragraphs, ...(p.refundRows ?? []).flatMap((row) => [row.days, row.refund])]),
      helpCtaLead(help, changed),
    ].join('\n');
    expect(staleFigures(text, live, changed)).toEqual([]);
    expect(text).toContain('A 40% advance holds your seats');
    expect(text).toContain('21 or more days');
    expect(text).toContain('9–20 days');
    expect(text).toContain('within 10 days of cancelling');
    expect(text).toContain('Children under 3');
    expect(text).toContain('We reply on WhatsApp within 4 hours');
    expect(text).toContain('We accept bank transfer, and nothing else');
  });

  it('rejects a sample other than true, a missing title or summary, a future update date and an unknown token', () => {
    const fieldsOf = (change: (c: HelpCopy) => void) => withChange(change).problems.map((p) => p.field);
    expect(fieldsOf((c) => Object.assign(c.policies.items[0], { sample: false }))).toEqual(['policies.items.0.sample']);
    expect(fieldsOf((c) => delete (c.policies.items[1] as Partial<HelpCopy['policies']['items'][number]>).title)).toEqual(['policies.items.1.title']);
    expect(fieldsOf((c) => delete (c.policies.items[1] as Partial<HelpCopy['policies']['items'][number]>).summary)).toEqual(['policies.items.1.summary']);
    expect(fieldsOf((c) => Object.assign(c, { policiesUpdated: '2999-01-01' }))).toEqual(['policiesUpdated']);
    expect(fieldsOf((c) => c.policies.items[2].paragraphs.push('Email {email}.'))).toEqual([
      `policies.items.2.paragraphs.${help.policies.items[2].paragraphs.length}`,
    ]);
  });
});
