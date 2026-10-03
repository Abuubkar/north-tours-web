import { GuideCard } from '@/components/guide-profile/GuideCard/GuideCard';
import type { GuidesGridProps } from './GuidesGrid.types';
import styles from './GuidesGrid.module.css';

/** "Meet the guides and drivers": a card per guide, each linking to their profile on the About page. */
export function GuidesGrid({ copy, guides }: GuidesGridProps) {
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
