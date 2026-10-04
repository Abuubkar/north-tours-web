'use client';

import { useId } from 'react';
import { Select } from '@/components/ui/Select/Select';
import { useBooking } from '@/hooks/useBooking';
import { dateRange } from '@/lib/utils/dates';
import { NO_UPCOMING_DATES, seatsLeftText } from '@/lib/utils/departures';
import { SeatsStatus } from '../../tour/SeatsStatus/SeatsStatus';
import { DepartureOption } from '../DepartureOption/DepartureOption';
import type { DepartureFieldProps } from './DepartureField.types';
import styles from './DepartureField.module.css';

/**
 * "Departure date": a radio per date, or on short screens a select ("12–20 May · 3 of 16 seats
 * left") with the chosen date's seats under it, so the panel's footer still fits on screen.
 */
export function DepartureField({ copy, compact, controlRef }: DepartureFieldProps) {
  const { departures, chosen, choose } = useBooking();
  const name = useId();

  if (departures.length === 0) {
    return (
      <div className={styles.field}>
        <p className={styles.label}>{copy.dateLabel}</p>
        <p className={styles.none}>{NO_UPCOMING_DATES}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={styles.field}>
        <Select
          ref={controlRef}
          label={copy.dateLabel}
          placeholder={copy.choosePlaceholder}
          options={departures.map((d) => ({ value: d.start, label: `${dateRange(d.start, d.end)} · ${seatsLeftText(d)}` }))}
          value={chosen?.start ?? null}
          onChange={choose}
        />
        {chosen && <SeatsStatus departure={chosen} />}
      </div>
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{copy.dateLabel}</legend>
      <div className={styles.options}>
        {departures.map((departure, i) => (
          <DepartureOption
            key={departure.start}
            ref={i === 0 ? controlRef : undefined}
            name={name}
            departure={departure}
            checked={departure === chosen}
            onChoose={choose}
          />
        ))}
      </div>
    </fieldset>
  );
}
