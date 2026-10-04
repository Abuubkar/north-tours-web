'use client';

import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { usePlanner } from '@/hooks/usePlanner';
import { reviewSections } from '@/lib/utils/plannerSummary';
import type { ReviewSummaryProps } from './ReviewSummary.types';
import styles from './ReviewSummary.module.css';

/**
 * Every answer before sending, in three sections (Where and when, Who's coming, Your details),
 * each an <h3> with an "Edit" that opens its step. Unanswered values read "Not given".
 */
export function ReviewSummary({ copy, steps }: ReviewSummaryProps) {
  const { trip, contact, edit } = usePlanner();
  const sections = reviewSections(trip, contact, [steps.whereWhen, steps.whosComing, steps.details], copy);

  return (
    <div className={styles.box}>
      {sections.map((section) => (
        <section key={section.step} className={styles.section}>
          <div className={styles.head}>
            <h3 className={styles.title}>{section.title}</h3>
            <TextLink variant="button" label={section.editLabel} onClick={() => edit(section.step)}>
              {copy.edit}
            </TextLink>
          </div>
          <dl className={styles.rows}>
            {section.rows.map(({ label, value }) => (
              <KeyValueRow key={label} layout="column" label={label}>
                {value ?? <span className={styles.notGiven}>{copy.notGiven}</span>}
              </KeyValueRow>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
