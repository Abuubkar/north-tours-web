import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getFaqs } from './faqs.ts';
import { getHelpPage, helpCategories } from './helpPage.ts';
import { helpCopyFile, loadHelpCopy, type HelpCopy } from './pages.ts';
import { getSettings } from './settings.ts';
import { contentFixture } from './testing.ts';

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
    expect(askHref).toBe(`https://wa.me/?text=${encodeURIComponent(settings.whatsapp.generalMessage)}`);
  });
});
