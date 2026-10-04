import type { PageHeaderProps } from './PageHeader.types';
import styles from './PageHeader.module.css';

/**
 * A page's opening without a photo: the <h1> at the statement size and a lead line under it
 * (Tours, the planner's first step). On the planner's later steps the same <h1> becomes a slim
 * line, so the page keeps exactly one <h1> on every step; the size is visual only.
 */
export function PageHeader({ headline, lead, variant = 'default' }: PageHeaderProps) {
  const classes = [styles.header, variant !== 'default' && styles[variant]].filter(Boolean).join(' ');
  return (
    <header className={classes}>
      <h1 className={variant === 'plannerSlim' ? styles.slimHeadline : styles.headline}>{headline}</h1>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}
