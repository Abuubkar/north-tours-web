import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { homeCopyFile, loadHomeCopy, type HomeCopy } from './pages.ts';
import { contentFixture } from './testing.ts';

const home: HomeCopy = JSON.parse(readFileSync(homeCopyFile(), 'utf8'));

function withChange(change: (copy: HomeCopy) => void) {
  const copy = structuredClone(home);
  change(copy);
  return loadHomeCopy(contentFixture({ 'pages/home.json': copy }));
}

const fields = (result: ReturnType<typeof loadHomeCopy>) => result.problems.map((p) => p.field);

describe('home page copy', () => {
  it('accepts the live file', () => {
    expect(loadHomeCopy().problems).toEqual([]);
  });

  it('rejects a missing or empty field, naming the file', () => {
    const result = withChange((c) => delete (c.hero as Partial<HomeCopy['hero']>).lead);
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].file).toMatch(/pages\/home\.json$/);
    expect(fields(withChange((c) => Object.assign(c.statement, { headline: ' ' })))).toEqual(['statement.headline']);
  });

  it('rejects a token the field does not take', () => {
    const result = withChange((c) => Object.assign(c.hero, { lead: 'Trips with a {advancePercent}% advance' }));
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].message).toBe('Unknown token {advancePercent}. Takes no tokens');
  });

  it('needs a real photo for the hero, not a placeholder', () => {
    const result = withChange((c) => Object.assign(c.hero, { image: { placeholder: 'Hunza at dawn', alt: 'Hunza' } }));
    expect(fields(result)).toContain('hero.image.src');
  });
});

describe('booking steps', () => {
  it('needs exactly four steps', () => {
    expect(fields(withChange((c) => c.how.steps.pop()))).toEqual(['how.steps']);
    expect(fields(withChange((c) => c.how.steps.push({ ...c.how.steps[0] })))).toEqual(['how.steps']);
  });

  it('takes the settings tokens, and no others', () => {
    expect(withChange((c) => Object.assign(c.how.steps[0], { text: 'From {pickupPoint}, {advancePercent}%' })).problems).toEqual([]);
    const result = withChange((c) => Object.assign(c.how.steps[2], { text: 'Pay by {paymentMethod}.' }));
    expect(fields(result)).toEqual(['how.steps.2.text']);
    expect(result.problems[0].message).toBe('Unknown token {paymentMethod}. Use only {advancePercent}, {paymentMethods}, {pickupPoint}');
  });
});

describe('photo focus', () => {
  it('accepts a focus point in percent', () => {
    expect(withChange((c) => Object.assign(c.hero.image, { focus: { x: 0, y: 100 } })).problems).toEqual([]);
  });

  it.each([
    [{ x: -1, y: 50 }, 'hero.image.focus.x'],
    [{ x: 50, y: 101 }, 'hero.image.focus.y'],
  ])('rejects %o', (focus, field) => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { focus })))).toEqual([field]);
  });

  it('rejects a photo narrower than the smallest variant', () => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { width: 400 })))).toEqual(['hero.image.width']);
  });
});
