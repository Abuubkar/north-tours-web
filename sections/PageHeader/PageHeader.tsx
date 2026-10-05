import { LastUpdated } from '@/components/ui/LastUpdated/LastUpdated';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { coverSizes, HERO_MAX_HEIGHT } from '@/lib/utils/images';
import type { PageHeaderProps, PageHeaderVariant } from './PageHeader.types';
import styles from './PageHeader.module.css';

const headlineClass: Record<PageHeaderVariant, string> = {
  default: styles.headline,
  planner: styles.headline,
  plannerSlim: styles.slimHeadline,
  about: styles.aboutHeadline,
  help: styles.headline,
  legal: styles.headline,
  contact: styles.headline,
};

/** The shell's padding: the planner's headers change it; the others keep the default. */
const headerClass: Record<PageHeaderVariant, string | undefined> = {
  default: undefined,
  planner: styles.planner,
  plannerSlim: styles.plannerSlim,
  about: styles.cover,
  help: styles.short,
  legal: styles.short,
  contact: undefined,
};

const leadClass: Record<PageHeaderVariant, string> = {
  default: styles.lead,
  planner: styles.plannerLead,
  plannerSlim: styles.lead,
  about: styles.aboutLead,
  help: styles.lead,
  legal: styles.lead,
  contact: styles.contactLead,
};

/** The text pages read on the light surface; the photo headers are always dark; the others follow the page. */
const LIGHT: ReadonlySet<PageHeaderVariant> = new Set(['help', 'legal']);
/** The photo headers, and each one's tallest, for its photo's `sizes`. */
const PHOTO_HEIGHT: Partial<Record<PageHeaderVariant, `${number}px`>> = {
  planner: HERO_MAX_HEIGHT.plannerBand,
  about: HERO_MAX_HEIGHT.photoHero,
};

/**
 * A page's opening: the <h1> and a lead line under it (Tours), over a photo on the planner's first
 * step (a band) and on About (a full-bleed cover, owner feedback 2026-10-05), on Help with the
 * search, on the legal pages with the date they were last updated. On the planner's later steps
 * the same <h1> becomes a slim line, so the page keeps exactly one <h1> on every step; the size is
 * visual only.
 */
export function PageHeader({ headline, lead, variant = 'default', image, updated, search }: PageHeaderProps) {
  const classes = [styles.header, headerClass[variant]].filter(Boolean).join(' ');
  const photoHeight = PHOTO_HEIGHT[variant];
  const photo = photoHeight !== undefined;
  return (
    <header className={classes} data-surface={LIGHT.has(variant) ? 'light' : photo ? 'dark' : undefined}>
      {photoHeight && image && (
        <>
          <div className={styles.photoMedia}>
            <MediaFrame image={image} ratio="fill" sizes={coverSizes(image, photoHeight)} priority />
          </div>
          <div className={styles.photoScrim} />
        </>
      )}
      <h1 className={headlineClass[variant]}>{headline}</h1>
      {lead && <p className={leadClass[variant]}>{lead}</p>}
      {search}
      {updated && <LastUpdated template={updated.template} date={updated.date} className={styles.updated} />}
    </header>
  );
}
