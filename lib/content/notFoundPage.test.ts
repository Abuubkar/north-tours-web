import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { notFoundPage } from './notFoundPage.ts';
import { getContactCopy, loadNotFoundCopy, notFoundCopyFile, type NotFoundCopy } from './pages.ts';
import { getSettings } from './settings.ts';
import { contentFixture } from './testing.ts';

const copy: NotFoundCopy = JSON.parse(readFileSync(notFoundCopyFile(), 'utf8'));

function fields(change: (copy: NotFoundCopy) => void) {
  const changed = structuredClone(copy);
  change(changed);
  const result = loadNotFoundCopy(contentFixture({ 'pages/not-found.json': changed }));
  for (const problem of result.problems) expect(problem.file).toMatch(/pages\/not-found\.json$/);
  return result.problems.map((p) => p.field);
}

describe('not-found page copy', () => {
  it('accepts the live copy', () => {
    expect(loadNotFoundCopy().problems).toEqual([]);
  });

  it('rejects a missing field', () => {
    expect(fields((c) => delete (c.empty as Partial<NotFoundCopy['empty']>).askLabel)).toEqual(['empty.askLabel']);
    expect(fields((c) => delete (c as Partial<NotFoundCopy>).description)).toEqual(['description']);
  });

  it('rejects an empty quick link list and a page that isn’t in the route map', () => {
    expect(fields((c) => Object.assign(c, { quickLinks: [] }))).toEqual(['quickLinks']);
    expect(fields((c) => Object.assign(c.quickLinks[0], { page: 'blog' }))).toEqual(['quickLinks.0.page']);
    expect(fields((c) => Object.assign(c.quickLinks[0], { page: 'tour' }))).toEqual(['quickLinks.0.page']);
  });
});

describe('notFoundPage', () => {
  const rows: NotFoundCopy['quickLinks'] = [
    { label: 'Where to go', page: 'destinations' },
    { label: 'Ask a question', page: 'help' },
  ];

  it('links each quick link row to its page, under Contact’s label and “Follow the trips”', () => {
    const contact = getContactCopy();
    const { quickLinks } = notFoundPage({ ...copy, quickLinks: rows }, contact, getSettings());
    expect(quickLinks.links).toEqual([
      { label: 'Where to go', href: '/#destinations' },
      { label: 'Ask a question', href: '/help' },
    ]);
    expect([quickLinks.label, quickLinks.follow]).toEqual([contact.quickLinks.label, contact.quickLinks.follow]);
  });

  it('asks on WhatsApp with the general message', () => {
    const settings = getSettings();
    expect(notFoundPage(copy, getContactCopy(), settings).askHref).toContain(encodeURIComponent(settings.whatsapp.generalMessage));
  });
});
