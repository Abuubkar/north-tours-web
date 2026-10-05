'use client';

import { FormField } from '@/components/ui/FormField/FormField';
import { Input } from '@/components/ui/Input/Input';
import { usePlanner } from '@/hooks/usePlanner';
import { CHIP_OPTIONS, pickDeparture, pickOption, setAdults, setChildren, setOtherCity, type ChipQuestion, type ChipValue } from '@/lib/utils/plannerAnswers';
import { ADULTS, CHILDREN, DEPARTING_FROM, labelled } from '@/lib/utils/plannerOptions';
import { ChildAgeSelects } from '../ChildAgeSelects/ChildAgeSelects';
import { ChoiceChips } from '../ChoiceChips/ChoiceChips';
import { CounterRow } from '../CounterRow/CounterRow';
import type { StepWhosComingProps } from './StepWhosComing.types';
import styles from './StepWhosComing.module.css';

/**
 * Step 2, Who's coming: adults and children (with each child's age), then the chip questions:
 * group type, hotels, transport and budget take any number of answers; Departing from always has
 * one city (Lahore by default), and "Other city" asks which.
 */
export function StepWhosComing({ copy }: StepWhosComingProps) {
  const { answers, update, fieldId } = usePlanner();
  const { group } = copy;
  const chips = <K extends ChipQuestion>(question: K) => {
    return (
      <ChoiceChips
        id={fieldId(question)}
        label={copy[question].label}
        hint={copy[question].hint}
        options={labelled<ChipValue<K>>(CHIP_OPTIONS[question], copy[question].options as Record<ChipValue<K>, string>)}
        // TypeScript can't narrow `answers[question]` for a generic question; it holds that question's options.
        value={answers[question] as readonly ChipValue<K>[]}
        onPick={(id) => update((a) => pickOption(a, question, id))}
      />
    );
  };

  return (
    <>
      <FormField id={fieldId('group')} kind="group" label={group.label} hint={group.hint}>
        {() => (
          <div className={styles.counters}>
            <CounterRow
              label={group.adults.label}
              hint={group.adults.hint}
              value={answers.adults}
              min={ADULTS.min}
              max={ADULTS.max}
              onChange={(n) => update((a) => setAdults(a, n))}
              decreaseLabel={group.adults.fewer}
              increaseLabel={group.adults.more}
            />
            <CounterRow
              label={group.children.label}
              hint={group.children.hint}
              value={answers.children}
              min={CHILDREN.min}
              max={CHILDREN.max}
              onChange={(n) => update((a) => setChildren(a, n))}
              decreaseLabel={group.children.fewer}
              increaseLabel={group.children.more}
            />
            {answers.children > 0 && <ChildAgeSelects copy={copy.ages} />}
          </div>
        )}
      </FormField>
      {chips('groupType')}
      {chips('hotels')}
      {chips('transport')}
      <ChoiceChips
        id={fieldId('departingFrom')}
        label={copy.departingFrom.label}
        hint={copy.departingFrom.hint}
        options={labelled(DEPARTING_FROM, copy.departingFrom.options)}
        value={[answers.departingFrom]}
        onPick={(id) => update((a) => pickDeparture(a, id))}
      >
        {answers.departingFrom === 'other' && (
          <Input
            aria-label={copy.departingFrom.otherCity}
            placeholder={copy.departingFrom.otherCityPlaceholder}
            value={answers.otherCity}
            onChange={(event) => update((a) => setOtherCity(a, event.target.value))}
            className={styles.otherCity}
          />
        )}
      </ChoiceChips>
      {chips('budget')}
    </>
  );
}
