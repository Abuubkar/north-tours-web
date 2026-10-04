import { licenceUrl, SOURCE_NAMES } from '@/lib/utils/credits';
import type { PhotoCreditsProps } from './PhotoCredits.types';
import styles from './PhotoCredits.module.css';

/** The credits page: its <h1>, the intro, then a row per photo with its author, licence, any changes we made and source. */
export function PhotoCredits({ copy, credits }: PhotoCreditsProps) {
  return (
    <section className={styles.section}>
      <h1 className={styles.headline}>{copy.headline}</h1>
      <p className={styles.intro}>{copy.intro}</p>
      <ul className={styles.list}>
        {credits.map((credit) => {
          const licence = licenceUrl(credit.licence);
          return (
            <li key={credit.src} className={styles.row}>
              <p className={styles.shows}>{credit.alt}</p>
              <p className={styles.meta}>
                {credit.author} ·{' '}
                {licence ? (
                  <a href={licence} className={styles.link}>
                    {credit.licence}
                  </a>
                ) : (
                  credit.licence
                )}{' '}
                ·{' '}
                {credit.changes && <>{credit.changes} · </>}
                <a href={credit.sourceUrl} className={styles.link}>
                  {SOURCE_NAMES[credit.source]}
                </a>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
