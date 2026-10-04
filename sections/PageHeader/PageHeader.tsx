import type { PageHeaderProps } from './PageHeader.types';
import styles from './PageHeader.module.css';

/** A page's opening without a photo (Tours): the <h1> at the statement size and a lead line under it. */
export function PageHeader({ headline, lead }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <div className={styles.content}>
          <h1 className={styles.headline}>{headline}</h1>
          <p className={styles.lead}>{lead}</p>
        </div>
      </div>
    </header>
  );
}
