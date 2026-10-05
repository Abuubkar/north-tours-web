'use client';

import { usePlanner } from '@/hooks/usePlanner';
import { pickLength } from '@/lib/utils/plannerAnswers';
import { labelled, TRIP_LENGTHS } from '@/lib/utils/plannerOptions';
import { ChoiceChips } from '../ChoiceChips/ChoiceChips';
import { DatesField } from '../DatesField/DatesField';
import { DestinationChoices } from '../DestinationChoices/DestinationChoices';
import type { StepWhereWhenProps } from './StepWhereWhen.types';

/**
 * Step 1, Where and when: destinations, dates, and an optional trip length (the only length
 * question). Each question is a section of the step body, which divides them.
 */
export function StepWhereWhen({ destinations, copy }: StepWhereWhenProps) {
  const { answers, update, fieldId } = usePlanner();
  return (
    <>
      <DestinationChoices destinations={destinations} copy={copy.destinations} />
      <DatesField copy={copy.dates} />
      <ChoiceChips
        id={fieldId('length')}
        label={copy.length.label}
        hint={copy.length.hint}
        options={labelled(TRIP_LENGTHS, copy.length.options)}
        value={answers.length}
        onPick={(id) => update((a) => pickLength(a, id))}
      />
    </>
  );
}
