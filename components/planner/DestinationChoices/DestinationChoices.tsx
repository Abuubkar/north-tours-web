'use client';

import { FormField } from '@/components/ui/FormField/FormField';
import { usePlanner } from '@/hooks/usePlanner';
import { toggleDestination } from '@/lib/utils/plannerAnswers';
import { UNSURE } from '@/lib/utils/plannerOptions';
import { groupError } from '@/lib/utils/plannerValidation';
import { DestinationChoiceCard } from '../DestinationChoiceCard/DestinationChoiceCard';
import type { DestinationChoicesProps } from './DestinationChoices.types';
import styles from './DestinationChoices.module.css';

/** "Destinations": a card per destination and "Not sure, suggest something", any number ticked. */
export function DestinationChoices({ destinations, copy }: DestinationChoicesProps) {
  const { answers, choices, errors, update, fieldId } = usePlanner();
  const cards = [
    ...destinations.map((d) => ({ id: d.slug, label: d.name, image: d.image })),
    { id: UNSURE, label: copy.unsure, image: copy.unsureImage },
  ];
  return (
    <FormField id={fieldId('destinations-group')} kind="group" label={copy.label} hint={copy.hint} error={groupError(errors, 'destinations')} errorAt="start">
      {({ errorId, invalid }) => (
        <div className={styles.grid}>
          {cards.map((card, i) => (
            <DestinationChoiceCard
              key={card.id}
              id={i === 0 ? fieldId('destinations') : undefined}
              label={card.label}
              image={card.image}
              pressed={answers.destinations.includes(card.id)}
              invalid={invalid}
              describedBy={errorId}
              onToggle={() => update((a) => toggleDestination(a, card.id, choices.destinations))}
            />
          ))}
        </div>
      )}
    </FormField>
  );
}
