import { PolicyCard } from '@/components/help/PolicyCard/PolicyCard';
import { LastUpdated } from '@/components/ui/LastUpdated/LastUpdated';
import { POLICIES_ANCHOR } from '@/lib/routes';
import type { PoliciesProps } from './Policies.types';
import styles from './Policies.module.css';

/**
 * "Our booking policies, in plain words" (light, #policies): the headline with when they were
 * last updated beside it, then a card per policy, two to a row on wide screens.
 */
export function Policies({ copy, updated, policies }: PoliciesProps) {
  return (
    <section id={POLICIES_ANCHOR} data-surface="light" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <LastUpdated template={copy.lastUpdated} date={updated} className={styles.updated} />
      </div>
      <ul className={styles.grid}>
        {policies.map((policy) => (
          <li key={policy.id} className={styles.cell}>
            <PolicyCard {...policy} table={copy.refundTable} readMore={copy.readMore} hide={copy.hide} />
          </li>
        ))}
      </ul>
    </section>
  );
}
