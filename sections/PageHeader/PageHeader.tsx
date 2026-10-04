import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { PageHeaderProps } from './PageHeader.types';
import styles from './PageHeader.module.css';

type Variant = NonNullable<PageHeaderProps['variant']>;

const headlineClass: Record<Variant, string> = {
  default: styles.headline,
  planner: styles.headline,
  plannerSlim: styles.slimHeadline,
  about: styles.aboutHeadline,
};

const leadClass: Record<Variant, string> = {
  default: styles.lead,
  planner: styles.plannerLead,
  plannerSlim: styles.lead,
  about: styles.aboutLead,
};

/**
 * A page's opening: the <h1> and a lead line under it (Tours, the planner's first step), on About
 * with a wide photo below. On the planner's later steps the same <h1> becomes a slim line, so the
 * page keeps exactly one <h1> on every step; the size is visual only.
 */
export function PageHeader({ headline, lead, variant = 'default', image }: PageHeaderProps) {
  const classes = [styles.header, variant !== 'default' && styles[variant]].filter(Boolean).join(' ');
  return (
    <header className={classes}>
      <h1 className={headlineClass[variant]}>{headline}</h1>
      {lead && <p className={leadClass[variant]}>{lead}</p>}
      {image && <MediaFrame image={image} ratio="4:3" wideRatio="21:9" sizes="100vw" priority className={styles.photo} />}
    </header>
  );
}
