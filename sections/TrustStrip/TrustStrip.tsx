import { yearsSince } from '@/lib/utils/dates';
import { paymentMethodsLabel } from '@/lib/utils/payments';
import { fillTokens } from '@/lib/utils/tokens';
import type { TrustStripProps } from './TrustStrip.types';
import styles from './TrustStrip.module.css';

/**
 * Four facts that show the company is genuine: DTS licence, years operating (from the build
 * year), trips completed and accepted payments. Read from settings, so it's the same on every page.
 */
export function TrustStrip({ settings }: TrustStripProps) {
  const { trust } = settings;
  const years = yearsSince(trust.operatingSince, new Date().getFullYear());
  // The first three values are figures; "We accept" is a list, so it's set smaller.
  const cells = [
    { ...trust.licence, value: fillTokens(trust.licence.value, { licence: settings.legal.dtsLicence }), figure: true },
    { ...trust.operating, value: fillTokens(trust.operating.value, { years: String(years) }), figure: true },
    { ...trust.trips, value: trust.tripsCompleted, figure: true },
    { ...trust.payments, value: paymentMethodsLabel(settings), note: undefined, figure: false },
  ];

  return (
    <section className={styles.strip}>
      <dl className={styles.grid}>
        {cells.map(({ label, value, note, figure }) => (
          <div key={label} className={styles.cell}>
            <dt className={styles.label}>{label}</dt>
            <dd className={figure ? styles.value : styles.listValue}>{value}</dd>
            {note && <dd className={styles.note}>{note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
