import { TextLink } from '@/components/ui/TextLink/TextLink';
import { routes } from '@/lib/routes';
import type { TourCardsSectionProps } from './TourCardsSection.types';
import styles from './TourCardsSection.module.css';

/** A headline with a note and "All tours" beside it, then a grid of tour cards. */
export function TourCardsSection({ id, copy, children }: TourCardsSectionProps) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <div className={styles.meta}>
          <p className={styles.note}>{copy.note}</p>
          <TextLink href={routes.tours}>{copy.allToursLabel}</TextLink>
        </div>
      </div>
      <div className={styles.cards}>{children}</div>
    </section>
  );
}
