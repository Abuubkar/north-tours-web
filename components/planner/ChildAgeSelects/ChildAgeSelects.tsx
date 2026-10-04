'use client';

import { useId } from 'react';
import { FieldError } from '@/components/ui/FieldError/FieldError';
import { Select } from '@/components/ui/Select/Select';
import { usePlanner } from '@/hooks/usePlanner';
import { setAge } from '@/lib/utils/plannerAnswers';
import { ageLabel, AGES } from '@/lib/utils/plannerOptions';
import { fieldInvalid, groupError } from '@/lib/utils/plannerValidation';
import { fillTokens } from '@/lib/utils/tokens';
import type { ChildAgeSelectsProps } from './ChildAgeSelects.types';
import styles from './ChildAgeSelects.module.css';

/**
 * Each child's age, "helps us plan rooms and stops": a select per child ("Child 1"…), first
 * option "Age", then "Under 2" and 2 to 17. A missing age shows the error border, and the
 * message under the row is linked to every select without an age.
 */
export function ChildAgeSelects({ copy }: ChildAgeSelectsProps) {
  const { answers, errors, update, fieldId } = usePlanner();
  const labelId = useId();
  const errorId = useId();
  const message = groupError(errors, 'ages');
  const options = AGES.map((age) => ({ value: String(age), label: ageLabel(age, copy.underTwo) }));

  return (
    <div role="group" aria-labelledby={labelId} className={styles.ages} data-form-field>
      <span id={labelId} className={styles.label}>
        {copy.label}
      </span>
      <div className={styles.selects}>
        {answers.ages.map((age, i) => {
          const invalid = fieldInvalid(errors, `age-${i}`);
          return (
            <div key={i} className={styles.ageSelect}>
              <Select
                id={fieldId(`age-${i}`)}
                label={fillTokens(copy.child, { count: String(i + 1) })}
                placeholder={copy.placeholder}
                options={options}
                value={age === null ? null : String(age)}
                invalid={invalid}
                describedBy={invalid ? errorId : undefined}
                onChange={(value) => update((a) => setAge(a, i, Number(value)))}
              />
            </div>
          );
        })}
      </div>
      {message && <FieldError id={errorId} message={message} />}
    </div>
  );
}
