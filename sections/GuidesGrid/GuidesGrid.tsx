import { GuideCard } from '@/components/guide-profile/GuideCard/GuideCard';
import { GuideTeam } from '@/components/guide-profile/GuideTeam/GuideTeam';
import type { GuidesGridProps } from './GuidesGrid.types';
import styles from './GuidesGrid.module.css';

/**
 * Guides and drivers. On the Homepage, "Meet the guides and drivers": a card per guide, each
 * linking to their profile on the About page. On About (#guides), the whole team with an intro,
 * each card opening the guide's profile in place.
 */
export function GuidesGrid(props: GuidesGridProps) {
  if (props.variant === 'about') {
    const { copy, profiles } = props;
    return (
      <section id="guides" className={styles.section}>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.team}>
          <GuideTeam profiles={profiles} copy={copy} />
        </div>
      </section>
    );
  }

  const { copy, guides } = props;
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={styles.grid}>
        {guides.map((guide) => (
          <li key={guide.slug} className={styles.cell}>
            <GuideCard guide={guide} />
          </li>
        ))}
      </ul>
    </section>
  );
}
