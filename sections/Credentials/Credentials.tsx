import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { SectionLabel } from '@/components/ui/SectionLabel/SectionLabel';
import type { CredentialsProps } from './Credentials.types';
import styles from './Credentials.module.css';

/**
 * "Credentials": the only About section without a headline (DESIGN.md §6), so its label is the
 * section's <h2>. Then the licence, the company registration and any memberships as label-column
 * rows; the Memberships row is left out when there are none.
 */
export function Credentials({ credentials }: CredentialsProps) {
  const { licence, company, memberships } = credentials;
  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <div className={styles.label}>
          <SectionLabel as="h2">{credentials.label}</SectionLabel>
        </div>
        <dl className={styles.rows}>
          <KeyValueRow label={licence.label} layout="column">
            <span className={styles.licence}>{licence.value}</span>
            <span className={styles.note}>{licence.note}</span>
          </KeyValueRow>
          <KeyValueRow label={company.label} layout="column">
            {company.value}
          </KeyValueRow>
          {memberships.names.length > 0 && (
            <KeyValueRow label={memberships.label} layout="column">
              {memberships.names.join(', ')}
            </KeyValueRow>
          )}
        </dl>
      </div>
    </section>
  );
}
