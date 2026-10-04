import type { ClosingCtaProps } from './ClosingCta.types';
import styles from './ClosingCta.module.css';

/** A page's last call to action: a large headline, an optional lead line, two 56px buttons and what follows them. */
export function ClosingCta({ id, headline, lead, actions, children }: ClosingCtaProps) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
      <div className={styles.actions}>{actions}</div>
      {children && <div className={styles.after}>{children}</div>}
    </section>
  );
}
