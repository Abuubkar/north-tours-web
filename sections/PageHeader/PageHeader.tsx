import { LastUpdated } from '@/components/ui/LastUpdated/LastUpdated';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { PageHeaderProps, PageHeaderVariant } from './PageHeader.types';
import styles from './PageHeader.module.css';

const headlineClass: Record<PageHeaderVariant, string> = {
  default: styles.headline,
  planner: styles.headline,
  plannerSlim: styles.slimHeadline,
  about: styles.aboutHeadline,
  help: styles.headline,
  legal: styles.headline,
};

/** The shell's padding: the planner's headers change it; the others keep the default. */
const headerClass: Record<PageHeaderVariant, string | undefined> = {
  default: undefined,
  planner: styles.planner,
  plannerSlim: styles.plannerSlim,
  about: undefined,
  help: styles.short,
  legal: styles.short,
};

const leadClass: Record<PageHeaderVariant, string> = {
  default: styles.lead,
  planner: styles.plannerLead,
  plannerSlim: styles.lead,
  about: styles.aboutLead,
  help: styles.lead,
  legal: styles.lead,
};

/** The text pages read on the light surface; the others follow the page. */
const LIGHT: ReadonlySet<PageHeaderVariant> = new Set(['help', 'legal']);

/**
 * A page's opening: the <h1> and a lead line under it (Tours, the planner's first step), on About
 * with a wide photo below, on Help with the search, on the legal pages with the date they were
 * last updated. On the
 * planner's later steps the same <h1> becomes a slim line, so the page keeps exactly one <h1> on
 * every step; the size is visual only.
 */
export function PageHeader({ headline, lead, variant = 'default', image, updated, search }: PageHeaderProps) {
  const classes = [styles.header, headerClass[variant]].filter(Boolean).join(' ');
  return (
    <header className={classes} data-surface={LIGHT.has(variant) ? 'light' : undefined}>
      <h1 className={headlineClass[variant]}>{headline}</h1>
      {lead && <p className={leadClass[variant]}>{lead}</p>}
      {search}
      {updated && <LastUpdated template={updated.template} date={updated.date} className={styles.updated} />}
      {image && <MediaFrame image={image} ratio="4:3" wideRatio="21:9" sizes="100vw" priority className={styles.photo} />}
    </header>
  );
}
