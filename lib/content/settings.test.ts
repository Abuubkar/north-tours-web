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
  site: { url: 'https://example.pk' },
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
      Object.assign(s.site, { url: '[Site URL]' });
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

  it.each(['tourMessage', 'waitlistMessage'] as const)('rejects a missing or empty %s', (key) => {
    expect(fields(withChange((s) => delete (s.whatsapp as Partial<Settings['whatsapp']>)[key]))).toEqual([`whatsapp.${key}`]);
    expect(fields(withChange((s) => Object.assign(s.whatsapp, { [key]: '' })))).toEqual([`whatsapp.${key}`]);
  });

  it('rejects a message token other than {tour} and {date}', () => {
    const result = withChange((s) => Object.assign(s.whatsapp, { tourMessage: 'Hi, {tour} for {people}?' }));
    expect(fields(result)).toEqual(['whatsapp.tourMessage']);
    expect(result.problems[0].message).toBe('Unknown token {people}. Use only {tour}, {date}');
  });

  it('rejects a missing destination message, or one with a token other than {destination}', () => {
    expect(fields(withChange((s) => delete (s.whatsapp as Partial<Settings['whatsapp']>).destinationMessage))).toEqual([
      'whatsapp.destinationMessage',
    ]);
    const result = withChange((s) => Object.assign(s.whatsapp, { destinationMessage: 'A private trip to {place}' }));
    expect(fields(result)).toEqual(['whatsapp.destinationMessage']);
    expect(result.problems[0].message).toBe('Unknown token {place}. Use only {destination}');
  });

  it('rejects a missing guide share message, or one with a token other than {name}, {role} and {url}', () => {
    expect(fields(withChange((s) => delete (s.whatsapp as Partial<Settings['whatsapp']>).guideShareMessage))).toEqual([
      'whatsapp.guideShareMessage',
    ]);
    const result = withChange((s) => Object.assign(s.whatsapp, { guideShareMessage: 'Meet {guide}: {url}' }));
    expect(fields(result)).toEqual(['whatsapp.guideShareMessage']);
    expect(result.problems[0].message).toBe('Unknown token {guide}. Use only {name}, {role}, {url}');
  });

  it('rejects a missing visitOffice section or field', () => {
    expect(fields(withChange((s) => delete (s as Partial<Settings>).visitOffice))).toEqual(['visitOffice']);
    expect(fields(withChange((s) => delete (s.visitOffice as Partial<Settings['visitOffice']>).directionsLabel))).toEqual([
      'visitOffice.directionsLabel',
    ]);
    expect(fields(withChange((s) => delete (s.visitOffice.rows as Partial<Settings['visitOffice']['rows']>).open))).toEqual([
      'visitOffice.rows.open',
    ]);
    expect(fields(withChange((s) => Object.assign(s.visitOffice, { mapTitle: '' })))).toEqual(['visitOffice.mapTitle']);
    // The office photo slot went with the map (ADR-0029).
    expect(fields(withChange((s) => Object.assign(s.visitOffice, { image: { placeholder: 'Office', alt: 'Office' } })))).toEqual(['visitOffice']);
  });

  it('rejects an empty reserve message or one with an unknown token', () => {
    expect(fields(withChange((s) => Object.assign(s.whatsapp, { reserveMessage: '' })))).toEqual(['whatsapp.reserveMessage']);
    const result = withChange((s) => Object.assign(s.whatsapp, { reserveMessage: 'Reserve {seats} on {tour}' }));
    expect(fields(result)).toEqual(['whatsapp.reserveMessage']);
    expect(result.problems[0].message).toMatch(/^Unknown token \{seats\}/);
  });

  it('rejects a missing child age, or one that isn’t a child’s', () => {
    expect(fields(withChange((s) => delete (s.policies as Partial<Settings['policies']>).childFromAge))).toEqual([
      'policies.childFromAge',
    ]);
    expect(fields(withChange((s) => Object.assign(s.policies, { childFromAge: 18 })))).toEqual(['policies.childFromAge']);
  });

  it('rejects a missing refund window, or one of 0 days', () => {
    expect(fields(withChange((s) => delete (s.policies as Partial<Settings['policies']>).refundPaidWithinDays))).toEqual([
      'policies.refundPaidWithinDays',
    ]);
    expect(fields(withChange((s) => Object.assign(s.policies, { refundPaidWithinDays: 0 })))).toEqual(['policies.refundPaidWithinDays']);
    expect(fields(withChange((s) => Object.assign(s.policies, { refundPaidWithinDays: 2.5 })))).toEqual(['policies.refundPaidWithinDays']);
  });

  describe('refund schedule', () => {
    const schedule = (rows: [number, number][]) =>
      withChange((s) => Object.assign(s.policies, { refundSchedule: rows.map(([daysBefore, refundPercent]) => ({ daysBefore, refundPercent })) }));

    it('accepts a schedule from a full refund down to 0 days', () => {
      expect(schedule([[14, 100], [7, 50], [0, 0]]).problems).toEqual([]);
      expect(schedule([[30, 100], [0, 25]]).problems).toEqual([]);
    });

    it('must start with a full refund', () => {
      expect(fields(schedule([[14, 90], [0, 0]]))).toEqual(['policies.refundSchedule.0.refundPercent']);
    });

    it('must end at 0 days', () => {
      expect(fields(schedule([[14, 100], [7, 50]]))).toEqual(['policies.refundSchedule.1.daysBefore']);
    });

    it('must run from most days to fewest, never refunding more later', () => {
      expect(fields(schedule([[7, 100], [14, 50], [0, 0]]))).toEqual(['policies.refundSchedule.1.daysBefore']);
      expect(fields(schedule([[14, 100], [7, 50], [0, 60]]))).toEqual(['policies.refundSchedule.2.refundPercent']);
    });

    it('needs at least two rows', () => {
      expect(fields(schedule([[0, 100]]))).toEqual(['policies.refundSchedule']);
    });
  });

  it('rejects a missing trust section', () => {
    expect(fields(withChange((s) => delete (s as Partial<Settings>).trust))).toEqual(['trust']);
  });

  it.each([1800, 2014.5, new Date().getFullYear() + 1])('rejects %s as the year operating since', (year) => {
    expect(fields(withChange((s) => Object.assign(s.trust, { operatingSince: year })))).toEqual(['trust.operatingSince']);
  });

  it('rejects a trust value token other than its own', () => {
    expect(fields(withChange((s) => Object.assign(s.trust.operating, { value: '{licence} years' })))).toEqual([
      'trust.operating.value',
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

  it('rejects a site URL that is not a link or a placeholder', () => {
    expect(fields(withChange((s) => Object.assign(s.site, { url: 'example.pk' })))).toEqual(['site.url']);
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

describe('planner messages', () => {
  it('need every template', () => {
    expect(fields(withChange((s) => delete (s.whatsapp.planner as Partial<Settings['whatsapp']['planner']>).callBack))).toEqual([
      'whatsapp.planner.callBack',
    ]);
  });

  it('reject a token a line doesn’t take', () => {
    const result = withChange((s) => Object.assign(s.whatsapp.planner, { dates: '• Dates: {when}' }));
    expect(fields(result)).toEqual(['whatsapp.planner.dates']);
    expect(result.problems[0].message).toBe('Unknown token {when}. Use only {dates}');
    expect(withChange((s) => Object.assign(s.whatsapp.planner, { callBack: 'Call {phone} ({bestTime})' })).problems).toEqual([]);
  });

  it('flags the booking, trust and policies figures as sample only with true (ADR-0022)', () => {
    const sections = ['booking', 'trust', 'policies'] as const;
    expect(withChange((s) => sections.forEach((section) => Object.assign(s[section], { sample: true }))).problems).toEqual([]);
    for (const section of sections) {
      expect(fields(withChange((s) => Object.assign(s[section], { sample: false })))).toEqual([`${section}.sample`]);
    }
  });

  it('needs the maps’ vetting flag', () => {
    expect(fields(withChange((s) => Object.assign(s, { maps: {} })))).toEqual(['maps.surveyOfPakistanVetted']);
    expect(fields(withChange((s) => delete (s as Partial<Settings>).maps))).toEqual(['maps']);
    expect(withChange((s) => Object.assign(s.maps, { surveyOfPakistanVetted: true })).problems).toEqual([]);
  });
});
