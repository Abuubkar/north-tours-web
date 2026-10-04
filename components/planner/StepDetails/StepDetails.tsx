'use client';

import { FormField } from '@/components/ui/FormField/FormField';
import { Input } from '@/components/ui/Input/Input';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { usePlanner } from '@/hooks/usePlanner';
import { routes } from '@/lib/routes';
import { NOTES_MAX_LENGTH, pickBestTime } from '@/lib/utils/plannerDetails';
import { BEST_TIMES, labelled } from '@/lib/utils/plannerOptions';
import { groupError } from '@/lib/utils/plannerValidation';
import { splitAtToken } from '@/lib/utils/tokens';
import { ChoiceChips } from '../ChoiceChips/ChoiceChips';
import { PhoneField } from '../PhoneField/PhoneField';
import type { StepDetailsProps } from './StepDetails.types';
import styles from './StepDetails.module.css';

/**
 * Step 3, Your details: name, WhatsApp number, the best time to call and anything else. These
 * stay in memory only and leave the page only in the WhatsApp message the visitor sends.
 */
export function StepDetails({ copy }: StepDetailsProps) {
  const { details, errors, updateDetails, fieldId } = usePlanner();
  const [beforeLink, afterLink] = splitAtToken(copy.privacy.text, 'link');
  return (
    <>
      <FormField id={fieldId('name')} label={copy.name.label} hint={copy.name.hint} error={groupError(errors, 'name')}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            className={styles.field}
            autoComplete="name"
            placeholder={copy.name.placeholder}
            value={details.name}
            invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => updateDetails((d) => ({ ...d, name: event.target.value }))}
          />
        )}
      </FormField>
      <PhoneField copy={copy.phone} />
      <ChoiceChips
        id={fieldId('bestTime')}
        label={copy.bestTime.label}
        hint={copy.bestTime.hint}
        options={labelled(BEST_TIMES, copy.bestTime.options)}
        value={details.bestTime}
        onPick={(time) => updateDetails((d) => pickBestTime(d, time))}
      />
      <FormField id={fieldId('notes')} label={copy.notes.label} hint={copy.notes.hint}>
        {({ id, describedBy }) => (
          <Textarea
            id={id}
            className={styles.notes}
            maxLength={NOTES_MAX_LENGTH}
            placeholder={copy.notes.placeholder}
            value={details.notes}
            aria-describedby={describedBy}
            onChange={(event) => updateDetails((d) => ({ ...d, notes: event.target.value }))}
          />
        )}
      </FormField>
      <p className={styles.privacy}>
        {beforeLink}
        <TextLink variant="inline" href={routes.privacy}>
          {copy.privacy.link}
        </TextLink>
        {afterLink}
      </p>
    </>
  );
}
