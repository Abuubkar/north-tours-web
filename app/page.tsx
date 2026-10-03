import type { Metadata } from 'next';
import styles from './page.module.css';

// Throwaway placeholder for the foundation PRD (#1). The Homepage PRD replaces this page.

export const metadata: Metadata = {
  title: '[BRAND NAME] · Tours from Lahore to northern Pakistan',
  description:
    'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
};

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <section className={styles.block}>
        <p className={styles.brand}>[BRAND NAME]</p>
        <h1 className={styles.title}>
          Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway
        </h1>
        <p className={styles.lead}>
          Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.{' '}
          <a href="#good-to-know">Good to know before you go</a>
        </p>
      </section>
      <section id="good-to-know" className={styles.block} data-surface="light">
        <h2 className={styles.heading}>Good to know before you go</h2>
        <p className={styles.body}>
          Warm layers even in summer, cash for the upper valleys, and a day of rest before the high
          passes. <a href="#">Back to the top</a>
        </p>
      </section>
    </main>
  );
}
