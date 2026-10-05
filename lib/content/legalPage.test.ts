import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fillTokens } from '../utils/tokens.ts';
import { legalDocument } from './legalPage.ts';
import { legalCopyFile, loadLegalCopy, type LegalCopy } from './pages.ts';
import { getSettings } from './settings.ts';
import { changedSettings, contentFixture, staleFigures } from './testing.ts';

const legal: LegalCopy = JSON.parse(readFileSync(legalCopyFile(), 'utf8'));

function withChange(change: (copy: LegalCopy) => void) {
  const copy = structuredClone(legal);
  change(copy);
  return loadLegalCopy(contentFixture({ 'pages/legal.json': copy }));
}

const fields = (result: ReturnType<typeof loadLegalCopy>) => result.problems.map((p) => p.field);

/** Every word a document shows, its tokens filled from `settings`. */
const allText = (copy: LegalCopy, id: 'privacy' | 'terms', settings = getSettings()) => {
  const { title, description, headline, closing, sections } = legalDocument(copy, id, settings);
  // The closing line keeps {email}, where the page puts the email's link.
  return [title, description, headline, fillTokens(closing, { email: settings.contact.email }), ...sections.flatMap((section) => [section.heading, ...section.paragraphs])].join('\n');
};

describe('legal page copy', () => {
  it('accepts the live file, both documents marked as sample text (ADR-0020)', () => {
    expect(loadLegalCopy().problems).toEqual([]);
    expect(legal.privacy.sample).toBe(true);
    expect(legal.terms.sample).toBe(true);
  });

  it('rejects a section id used twice in a document', () => {
    const result = withChange((c) => Object.assign(c.terms.sections[1], { id: c.terms.sections[0].id }));
    expect(fields(result)).toEqual(['terms.sections.1.id']);
    expect(result.problems[0].message).toMatch(/used twice/);
  });

  it('rejects a "last updated" date after today, or not a real date', () => {
    expect(fields(withChange((c) => Object.assign(c.privacy, { lastUpdated: '2999-01-01' })))).toEqual(['privacy.lastUpdated']);
    expect(fields(withChange((c) => Object.assign(c.privacy, { lastUpdated: '2026-02-30' })))).toEqual(['privacy.lastUpdated']);
  });

  it('accepts sample only as true', () => {
    expect(fields(withChange((c) => Object.assign(c.terms, { sample: false })))).toEqual(['terms.sample']);
    expect(fields(withChange((c) => Object.assign(c.terms, { sample: 'yes' })))).toEqual(['terms.sample']);
    // The owner confirms the text by removing the field.
    expect(withChange((c) => delete c.terms.sample).problems).toEqual([]);
  });

  it('rejects a token a section can’t take', () => {
    const result = withChange((c) => c.privacy.sections[0].paragraphs.push('Call {travelSupport}.'));
    expect(fields(result)).toEqual([`privacy.sections.0.paragraphs.${legal.privacy.sections[0].paragraphs.length}`]);
    expect(result.problems[0].message).toMatch(/^Unknown token \{travelSupport\}/);
  });
});

describe('legal documents', () => {
  it('numbers the sections in order and fills every token', () => {
    const privacy = legalDocument(legal, 'privacy', getSettings());
    expect(privacy.sections.map((s) => s.number)).toEqual(privacy.sections.map((_, i) => i + 1));
    for (const id of ['privacy', 'terms'] as const) expect(allText(legal, id)).not.toMatch(/\{\w+\}/);
  });

  it('reads the payment methods as "cash or bank transfer", and nothing else (ADR-0008)', () => {
    for (const id of ['privacy', 'terms'] as const) {
      expect(allText(legal, id)).not.toMatch(/JazzCash|Easypaisa|card/i);
    }
    expect(allText(legal, 'terms')).toContain('We accept cash or bank transfer');
  });

  it('shows changed settings everywhere, and none of the old figures', () => {
    const live = getSettings();
    const changed = changedSettings(live);
    for (const id of ['privacy', 'terms'] as const) {
      expect(staleFigures(allText(legal, id, changed), live, changed)).toEqual([]);
    }
    const terms = allText(legal, 'terms', changed);
    expect(terms).toContain('a 40% advance');
    expect(terms).toContain('We accept bank transfer, and nothing else');
    expect(terms).toContain('Cancel 21 or more days before departure');
    expect(terms).toContain('within 10 days of cancelling');
    expect(terms).toContain('up to 21 days before departure');
    expect(terms).toContain('due 12 days before departure');
    expect(terms).toContain('Children under 3');
    expect(allText(legal, 'privacy', changed)).toContain('We reply within 4 hours');
  });

  it('describes the site as built (ADR-0020): no cookies or analytics of its own, planner answers in the browser, WhatsApp and Google Maps as third parties', () => {
    const privacy = allText(legal, 'privacy');
    expect(privacy).toContain('sets no cookies of its own and uses no analytics');
    expect(privacy).toContain('in this browser’s storage');
    expect(privacy).toContain('Your name, number, best time to call and notes are never stored');
    expect(privacy).toContain('WhatsApp is run by a separate company');
    expect(privacy).toContain('take you to Google Maps itself');
  });

  it('says the office map loads from Google, which may set cookies and receives the visitor’s IP address (ADR-0029)', () => {
    const privacy = allText(legal, 'privacy');
    expect(privacy).toContain('The About and Contact pages show our office on a Google map.');
    expect(privacy).toContain('Google receives your IP address');
    expect(privacy).toContain('may set its own cookies');
    expect(privacy).toContain('policies.google.com/privacy');
    expect(legal.privacy.sample).toBe(true);
  });
});
