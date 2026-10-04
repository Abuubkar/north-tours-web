'use client';

import { useId } from 'react';
import { Chip } from '@/components/ui/Chip/Chip';
import { FormField } from '@/components/ui/FormField/FormField';
import { Input } from '@/components/ui/Input/Input';
import { Stepper } from '@/components/ui/Stepper/Stepper';
import { usePlanner } from '@/hooks/usePlanner';
import { pickMonth } from '@/lib/utils/plannerAnswers';
import { DATE_MODES, DAYS, monthLabel } from '@/lib/utils/plannerOptions';
import { fieldInvalid, groupError } from '@/lib/utils/plannerValidation';
import type { DatesFieldProps } from './DatesField.types';
import styles from './DatesField.module.css';

/**
 * "Dates": exact dates (From and To, nothing before today in Karachi, To not before From), or
 * flexible (one of the next 12 months and roughly how many days).
 */
export function DatesField({ copy }: DatesFieldProps) {
  const { answers, choices, errors, today, update, fieldId } = usePlanner();
  const monthLabelId = useId();
  const exact = answers.dateMode === 'exact';

  return (
    <FormField id={fieldId('dates-group')} kind="group" label={copy.label} hint={copy.hint} error={groupError(errors, 'dates')}>
      {({ errorId }) => (
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
                    min={end === 'to' && answers.from && answers.from > today ? answers.from : today}
                    value={answers[end] ?? ''}
                    invalid={fieldInvalid(errors, end)}
                    aria-describedby={fieldInvalid(errors, end) ? errorId : undefined}
                    onChange={(event) => update((a) => ({ ...a, [end]: event.target.value || null }))}
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
                    pressed={answers.month === month}
                    aria-describedby={fieldInvalid(errors, 'month') ? errorId : undefined}
                    onClick={() => update((a) => pickMonth(a, month))}
                  >
                    {monthLabel(month)}
                  </Chip>
                ))}
              </div>
              <div className={styles.days}>
                <span aria-hidden="true">{copy.roughly}</span>
                <Stepper
                  label={copy.daysLabel}
                  value={answers.days}
                  min={DAYS.min}
                  max={DAYS.max}
                  onChange={(days) => update((a) => ({ ...a, days }))}
                  decreaseLabel={copy.fewerDays}
                  increaseLabel={copy.moreDays}
                />
                <span aria-hidden="true">{copy.days}</span>
              </div>
            </div>
          )}
        </>
      )}
    </FormField>
  );
}
