import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { headlineSize } from '@/lib/utils/headline';
import type { OurStoryProps } from './OurStory.types';
import styles from './OurStory.module.css';

/** The founder's portrait: beside the text from 820px (at most 320px), the full column below. */
const PORTRAIT_SIZES = '(width >= 820px) 320px, 100vw';

const headlineClass = { standard: styles.headline, long: styles.longHeadline };

/**
 * "Running trips north since 2014": how the company started, beside the founder's portrait and
 * name (a placeholder until the owner's photo, ADR-0009).
 */
export function OurStory({ copy }: OurStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.split}>
        <div className={styles.text}>
          <h2 className={headlineClass[headlineSize(copy.headline)]}>{copy.headline}</h2>
          <div className={styles.paragraphs}>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <figure className={styles.founder}>
          <MediaFrame image={copy.founder.portrait} ratio="4:5" sizes={PORTRAIT_SIZES} />
          <figcaption className={styles.caption}>
            <span className={styles.name}>{copy.founder.name}</span>
            <span className={styles.role}>{copy.founder.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
