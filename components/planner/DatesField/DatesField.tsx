'use client';

import { useId } from 'react';
import { Chip } from '@/components/ui/Chip/Chip';
import { FormField } from '@/components/ui/FormField/FormField';
import { Input } from '@/components/ui/Input/Input';
import { usePlanner } from '@/hooks/usePlanner';
import { shortMonthYear } from '@/lib/utils/dates';
import { dateMin, pickMonth, setDate } from '@/lib/utils/plannerAnswers';
import { DATE_MODES } from '@/lib/utils/plannerOptions';
import { fieldInvalid, groupError } from '@/lib/utils/plannerValidation';
import type { DatesFieldProps } from './DatesField.types';
import styles from './DatesField.module.css';

/**
 * "Dates": exact dates (From and To, nothing before today in Karachi, To not before From), or
 * flexible (any of the next 12 months). How long the trip is, is the Trip length question's.
 */
export function DatesField({ copy }: DatesFieldProps) {
  const { answers, choices, errors, today, update, fieldId } = usePlanner();
  const monthLabelId = useId();
  const exact = answers.dateMode === 'exact';

  return (
    <FormField id={fieldId('dates-group')} kind="group" label={copy.label} hint={copy.hint} error={groupError(errors, 'dates')}>
      {({ hintId, errorId }) => (
        <>
          <div role="group" aria-label={copy.modeLabel} className={styles.chips}>
            {DATE_MODES.map((mode) => (
              <Chip key={mode} variant="toggle" pressed={answers.dateMode === mode} onClick={() => update((a) => ({ ...a, dateMode: mode }))}>
                {copy.modes[mode]}
              </Chip>
            ))}
          </div>
          {exact ? (
            <div className={styles.dates}>
              {(['from', 'to'] as const).map((end) => (
                <div key={end} className={styles.date}>
                  <label htmlFor={fieldId(end)} className={styles.small}>
                    {copy[end]}
                  </label>
                  <Input
                    id={fieldId(end)}
                    type="date"
                    min={dateMin(answers, end, today)}
                    value={answers[end] ?? ''}
                    invalid={fieldInvalid(errors, end)}
                    aria-describedby={[hintId, fieldInvalid(errors, end) && errorId].filter(Boolean).join(' ') || undefined}
                    onChange={(event) => update((a) => setDate(a, end, event.target.value))}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.flexible}>
              <span id={monthLabelId} className={styles.small}>
                {copy.month}
              </span>
              <div role="group" aria-labelledby={monthLabelId} className={styles.chips}>
                {choices.months.map((month, i) => (
                  <Chip
                    key={month}
                    id={i === 0 ? fieldId('month') : undefined}
                    variant="toggle"
                    pressed={answers.months.includes(month)}
                    aria-describedby={fieldInvalid(errors, 'month') ? errorId : undefined}
                    onClick={() => update((a) => pickMonth(a, month))}
                  >
                    {shortMonthYear(month)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </FormField>
  );
}
