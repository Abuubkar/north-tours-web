import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ContentError, requireValid } from './files.ts';
import { loadSettings, settingsFile, type Settings } from './settings.ts';
import { contentFixture } from './testing.ts';

const valid: Settings = JSON.parse(readFileSync(settingsFile(), 'utf8'));

/** Real values everywhere, so placeholder handling is tested separately from the live file. */
const real: Settings = {
  ...valid,
  contact: {
    ...valid.contact,
    whatsapp: '+92 300 1234567',
    phone: '+92 42 3578 1234',
    email: 'hello@example.pk',
    travelSupport: '+92 321 7654321',
  },
  social: {
    instagram: 'https://instagram.com/example',
    facebook: 'https://facebook.com/example',
    youtube: 'https://youtube.com/@example',
  },
};

/** Loads settings after a change; tests that set invalid values use Object.assign. */
function withChange(change: (settings: Settings) => void) {
  const copy = structuredClone(real);
  change(copy);
  return loadSettings(contentFixture({ 'settings.json': copy }));
}

function fields(result: ReturnType<typeof loadSettings>) {
  return result.problems.map((problem) => problem.field);
}

describe('settings', () => {
  it('accepts the live settings file', () => {
    expect(loadSettings().problems).toEqual([]);
  });

  it('accepts real contact and social values', () => {
    expect(withChange(() => {}).problems).toEqual([]);
  });

  it('accepts [placeholder] contact, legal and social values (ADR-0010)', () => {
    const result = withChange((s) => {
      Object.assign(s.contact, { whatsapp: '[+92 3XX XXX XXXX]', email: '[hello@brand.pk]' });
      Object.assign(s.legal, { dtsLicence: '[DTS licence number]' });
      Object.assign(s.social, { instagram: '[Instagram URL]' });
    });
    expect(result.problems).toEqual([]);
  });

  it('rejects a missing section', () => {
    expect(fields(withChange((s) => delete (s as Partial<Settings>).booking))).toContain('booking');
  });

  it('rejects a missing whatsapp section', () => {
    expect(fields(withChange((s) => delete (s as Partial<Settings>).whatsapp))).toContain('whatsapp');
  });

  it('rejects an empty WhatsApp message', () => {
    expect(fields(withChange((s) => Object.assign(s.whatsapp, { generalMessage: ' ' })))).toEqual([
      'whatsapp.generalMessage',
    ]);
  });

  it('rejects a malformed email and names the file and field', () => {
    const result = withChange((s) => Object.assign(s.contact, { email: 'not-an-email' }));
    expect(result.problems).toEqual([
      expect.objectContaining({
        field: 'contact.email',
        message: 'Must be an email address, or a [placeholder]',
      }),
    ]);
    expect(result.problems[0].file).toMatch(/settings\.json$/);
  });

  it('rejects a phone number not in +92 form', () => {
    expect(fields(withChange((s) => Object.assign(s.contact, { whatsapp: '0300 1234567' })))).toEqual([
      'contact.whatsapp',
    ]);
  });

  it.each([0, 101, 12.5])('rejects an advance of %s%%', (advance) => {
    expect(fields(withChange((s) => Object.assign(s.booking, { advancePercent: advance })))).toEqual([
      'booking.advancePercent',
    ]);
  });

  it('rejects an empty or repeated payments list', () => {
    expect(fields(withChange((s) => Object.assign(s.payments, { methods: [] })))).toEqual(['payments.methods']);
    expect(fields(withChange((s) => Object.assign(s.payments, { methods: ['Cash', 'Cash'] })))).toEqual([
      'payments.methods',
    ]);
  });

  it('reports every problem at once', () => {
    const result = withChange((s) => {
      Object.assign(s.contact, { email: 'nope' });
      Object.assign(s.booking, { advancePercent: 0 });
    });
    expect(fields(result)).toEqual(['contact.email', 'booking.advancePercent']);
  });

  it('reports a file that is not valid JSON', () => {
    const result = loadSettings(contentFixture({ 'settings.json': '{ broken' }));
    expect(result.data).toBeNull();
    expect(result.problems).toHaveLength(1);
  });
});

describe('requireValid', () => {
  it('returns valid data', () => {
    expect(requireValid(withChange(() => {}))).toMatchObject({ brand: real.brand });
  });

  it('throws a ContentError naming the file and field', () => {
    const invalid = withChange((s) => Object.assign(s.contact, { email: 'nope' }));
    expect(() => requireValid(invalid)).toThrow(ContentError);
    expect(() => requireValid(invalid)).toThrow(/settings\.json › contact\.email/);
  });
});
