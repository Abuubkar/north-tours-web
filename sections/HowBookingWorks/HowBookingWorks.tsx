import { StepCell } from '@/components/steps/StepCell/StepCell';
import type { HowBookingWorksProps } from './HowBookingWorks.types';
import styles from './HowBookingWorks.module.css';

/** "How booking works": the four steps as an ordered list, in a text grid that lines up with the margins. */
export function HowBookingWorks({ copy }: HowBookingWorksProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ol className={styles.steps}>
        {copy.steps.map((step, i) => (
          <StepCell key={step.title} number={i + 1} title={step.title} text={step.text} arrow={i < copy.steps.length - 1} />
        ))}
      </ol>
    </section>
  );
}
