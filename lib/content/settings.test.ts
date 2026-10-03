import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadSettings, settingsFile } from './settings';
import { contentFixture } from './testing';

const valid = JSON.parse(readFileSync(settingsFile(), 'utf8'));

function withChange(change: (settings: typeof valid) => void) {
  const copy = structuredClone(valid);
  change(copy);
  return loadSettings(contentFixture({ 'settings.json': copy }));
}

function fields(result: ReturnType<typeof loadSettings>) {
  return result.problems.map((problem) => problem.field);
}

describe('settings', () => {
  it('accepts the real settings, including [placeholder] contact and legal values', () => {
    expect(loadSettings().problems).toEqual([]);
  });

  it('accepts real contact values', () => {
    const result = withChange((s) => {
      s.contact.whatsapp = '+92 300 1234567';
      s.contact.email = 'hello@example.pk';
      s.social.instagram = 'https://instagram.com/example';
    });
    expect(result.problems).toEqual([]);
  });

  it('rejects a missing section', () => {
    expect(fields(withChange((s) => delete s.booking))).toContain('booking');
  });

  it('rejects a malformed email and names the file and field', () => {
    const result = withChange((s) => (s.contact.email = 'not-an-email'));
    expect(result.problems).toEqual([
      expect.objectContaining({
        field: 'contact.email',
        message: 'Must be an email address, or a [placeholder]',
      }),
    ]);
    expect(result.problems[0].file).toMatch(/settings\.json$/);
  });

  it('rejects a phone number not in +92 form', () => {
    expect(fields(withChange((s) => (s.contact.whatsapp = '0300 1234567')))).toEqual(['contact.whatsapp']);
  });

  it.each([0, 101, 12.5])('rejects an advance of %s%%', (advance) => {
    expect(fields(withChange((s) => (s.booking.advancePercent = advance)))).toEqual([
      'booking.advancePercent',
    ]);
  });

  it('rejects an empty payments list and unknown methods', () => {
    expect(fields(withChange((s) => (s.payments.methods = [])))).toEqual(['payments.methods']);
    expect(fields(withChange((s) => (s.payments.methods = ['Card'])))).toEqual(['payments.methods.0']);
  });

  it('reports every problem at once', () => {
    const result = withChange((s) => {
      s.contact.email = 'nope';
      s.booking.advancePercent = 0;
    });
    expect(fields(result)).toEqual(['contact.email', 'booking.advancePercent']);
  });

  it('reports a file that is not valid JSON', () => {
    const result = loadSettings(contentFixture({ 'settings.json': '{ broken' }));
    expect(result.data).toBeNull();
    expect(result.problems).toHaveLength(1);
  });
});
