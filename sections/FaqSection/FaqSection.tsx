import { Accordion } from '@/components/ui/Accordion/Accordion';
import type { FaqSectionProps } from './FaqSection.types';
import styles from './FaqSection.module.css';

/** "Questions people ask before booking" (light, #faqs): one accordion, one open at a time, the first open. */
export function FaqSection({ headline, questions }: FaqSectionProps) {
  return (
    <section id="faqs" data-surface="light" className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <div className={styles.list}>
        <Accordion
          name="tour-faqs"
          items={questions.map(({ question, answer }, i) => ({
            id: question,
            summary: question,
            content: answer,
            defaultOpen: i === 0,
          }))}
        />
      </div>
    </section>
  );
}
