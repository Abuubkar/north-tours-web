import { yearsSince } from '@/lib/utils/dates';
import { paymentMethodsLabel } from '@/lib/utils/payments';
import { fillTokens } from '@/lib/utils/tokens';
import type { TrustStripProps } from './TrustStrip.types';
import styles from './TrustStrip.module.css';

/**
 * Facts that show the company is genuine, read from settings so they're the same on every page:
 * DTS licence, years operating (up to the build year), trips completed and accepted payments.
 * The mini strip, inside Tour Detail's final call to action, has the licence, the pickup point
 * and the payments.
 */
export function TrustStrip({ variant = 'full', settings, year }: TrustStripProps) {
  const { trust } = settings;
  const licence = { ...trust.licence, value: fillTokens(trust.licence.value, { licence: settings.legal.dtsLicence }), figure: true };
  const payments = { ...trust.payments, value: paymentMethodsLabel(settings), note: undefined, figure: false };

  if (variant === 'mini') {
    const cells = [
      licence,
      { ...trust.departs, value: settings.booking.pickupPoint },
      payments,
    ];
    return (
      <dl className={styles.miniGrid}>
        {cells.map(({ label, value }) => (
          <div key={label} className={styles.miniCell}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.miniValue}>{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  const years = yearsSince(trust.operatingSince, year);
  // The first three values are figures; "We accept" is a list, so it's set smaller.
  const cells = [
    licence,
    { ...trust.operating, value: fillTokens(trust.operating.value, { years: String(years) }), figure: true },
    { ...trust.trips, value: trust.tripsCompleted, figure: true },
    payments,
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
