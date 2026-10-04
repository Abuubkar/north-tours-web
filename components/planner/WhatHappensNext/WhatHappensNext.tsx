import type { WhatHappensNextProps } from './WhatHappensNext.types';
import styles from './WhatHappensNext.module.css';

/** "What happens next": the three steps after sending, in order (a real sequence), then the DTS licence line. */
export function WhatHappensNext({ copy }: WhatHappensNextProps) {
  return (
    <div className={styles.next}>
      <section className={styles.panel}>
        <h2 className={styles.title}>{copy.title}</h2>
        <ol className={styles.steps}>
          {copy.steps.map((step) => (
            <li key={step} className={styles.step}>
              {step}
            </li>
          ))}
        </ol>
      </section>
      <p className={styles.licence}>
        <strong className={styles.number}>{copy.licence}</strong> · {copy.office}
      </p>
    </div>
  );
}
