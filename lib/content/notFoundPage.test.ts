import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getNotFoundPage } from './notFoundPage.ts';
import { loadNotFoundCopy, notFoundCopyFile, type NotFoundCopy } from './pages.ts';
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

describe('getNotFoundPage', () => {
  it('links each quick link row to its page, under Contact’s label and “Follow the trips”', () => {
    const { quickLinks } = getNotFoundPage();
    expect(quickLinks.links).toEqual([
      { label: 'Plan a private trip', href: '/plan' },
      { label: 'Destinations', href: '/#destinations' },
      { label: 'About us and our guides', href: '/about' },
      { label: 'Help & FAQs', href: '/help' },
    ]);
    expect([quickLinks.label, quickLinks.follow]).toEqual(['Quick links', 'Follow the trips']);
  });

  it('asks on WhatsApp with the general message', () => {
    const { askHref, settings } = getNotFoundPage();
    expect(askHref).toContain(encodeURIComponent(settings.whatsapp.generalMessage));
  });
});
