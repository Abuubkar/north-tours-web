import type { Settings } from './settings.ts';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Writes content files into a fresh temporary content folder for a test. */
export function contentFixture(files: Record<string, unknown>): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'content-'));
  for (const [name, data] of Object.entries(files)) {
    const file = path.join(dir, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data));
  }
  return dir;
}

/**
 * The live settings with every figure text may quote changed: a 40% advance, a full refund from
 * 21 days, a 10-day refund window, children from 3, another reply time, bank transfer only and so on. Text filled
 * with these must show none of the live figures; one that does was typed in, not a token.
 */
export function changedSettings(settings: Settings): Settings {
  return {
    ...settings,
    booking: { ...settings.booking, advancePercent: 40, replyTime: 'within 4 hours' },
    // The office hours carry figures of their own ("10 am – 6 pm"), so they change too.
    contact: { ...settings.contact, officeHours: '9 am – 8 pm' },
    payments: { methods: ['Bank transfer'] },
    policies: {
      refundSchedule: [
        { daysBefore: 21, refundPercent: 100 },
        { daysBefore: 9, refundPercent: 60 },
        { daysBefore: 0, refundPercent: 0 },
      ],
      balanceDueDays: 12,
      refundPaidWithinDays: 10,
      childFromAge: 3,
    },
  };
}

/** The figures settings put into text: the advance, the refund schedule's days and shares, the balance, the refund window and the children's age. */
function settingsFigures({ booking, policies }: Settings): Set<string> {
  const rows = policies.refundSchedule;
  return new Set(
    [
      booking.advancePercent,
      ...rows.flatMap((row) => [row.daysBefore, row.daysBefore - 1, row.refundPercent]),
      policies.balanceDueDays,
      policies.refundPaidWithinDays,
      policies.childFromAge,
    ]
      .filter((figure) => figure > 0 && figure !== 100)
      .map(String),
  );
}

/**
 * The live settings' figures, reply time and payment methods left in `text` after it was filled
 * with `changed` settings: none means every one of them came from a token. `[placeholders]` are skipped.
 */
export function staleFigures(text: string, live: Settings, changed: Settings): string[] {
  const now = settingsFigures(changed);
  const stale = [...settingsFigures(live)].filter((figure) => !now.has(figure));
  const numbers = text.replace(/\[[^\]]*\]/g, '').match(/\d+(?:,\d{3})*/g) ?? [];
  const found = [...new Set(numbers)].filter((n) => stale.includes(n));
  const methods = live.payments.methods.filter((method) => !changed.payments.methods.includes(method));
  const words = [live.booking.replyTime, ...methods].filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(text));
  return [...found, ...words];
}
