'use client';

import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { usePlanner } from '@/hooks/usePlanner';
import { fillTokens } from '@/lib/utils/tokens';
import type { ReviewSection, ReviewSummaryProps } from './ReviewSummary.types';
import styles from './ReviewSummary.module.css';

/**
 * Every answer before sending, in three sections (Where and when, Who's coming, Your details),
 * each an <h3> with an "Edit" that opens its step. Unanswered values read "Not given".
 */
export function ReviewSummary({ copy, steps }: ReviewSummaryProps) {
  const { trip, contact, edit } = usePlanner();
  const row = (key: keyof typeof copy.rows, value: string | null) => ({ label: copy.rows[key], value });
  const sections: ReviewSection[] = [
    { step: 1, title: steps.whereWhen, rows: [row('destinations', trip.destinations), row('dates', trip.dates), row('length', trip.length)] },
    {
      step: 2,
      title: steps.whosComing,
      rows: [row('group', trip.group), row('groupType', trip.groupType), row('hotels', trip.hotels), row('transport', trip.transport), row('from', trip.from), row('budget', trip.budget)],
    },
    { step: 3, title: steps.details, rows: [row('name', contact.name), row('phone', contact.phone), row('bestTime', contact.bestTime), row('notes', contact.notes)] },
  ];

  return (
    <div className={styles.box}>
      {sections.map((section) => (
        <section key={section.step} className={styles.section}>
          <div className={styles.head}>
            <h3 className={styles.title}>{section.title}</h3>
            <TextLink variant="button" label={fillTokens(copy.editLabel, { section: section.title.toLowerCase() })} onClick={() => edit(section.step)}>
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
