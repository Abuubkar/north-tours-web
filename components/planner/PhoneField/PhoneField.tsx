'use client';

import { useId } from 'react';
import { FormField } from '@/components/ui/FormField/FormField';
import { Input } from '@/components/ui/Input/Input';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { usePlanner } from '@/hooks/usePlanner';
import { CODE_MAX_LENGTH, PK_MAX_LENGTH, phoneTyped, type Phone } from '@/lib/utils/phone';
import { fieldInvalid } from '@/lib/utils/plannerValidation';
import type { PhoneFieldProps } from './PhoneField.types';
import styles from './PhoneField.module.css';

/**
 * "WhatsApp number": "+92" joined to a Pakistani mobile, typed the way people write it (digits
 * and spaces, a numeric keypad). "Outside Pakistan?" switches to "+", a country code and a number;
 * "Pakistani number?" switches back. Each way keeps what was typed in it, and the message sits
 * under the field, linked to the input that's wrong.
 */
export function PhoneField({ copy, error }: PhoneFieldProps) {
  const { details, errors, updateDetails, switchPhoneMode, fieldId } = usePlanner();
  const prefixId = useId();
  const { phone } = details;
  const setPhone = (change: Partial<Phone>) => updateDetails((d) => ({ ...d, phone: { ...d.phone, ...change } }));
  /** An input's description: the given ids (the prefix, the hint), and the message while it's the wrong one. */
  const describe = (field: string, errorId: string | undefined, ...ids: (string | undefined)[]) =>
    [...ids, fieldInvalid(errors, field) && errorId].filter(Boolean).join(' ') || undefined;

  const pakistani = (
    <FormField id={fieldId('phone')} label={copy.label} hint={copy.hint} error={error} className={styles.field}>
      {({ id, hintId, errorId, invalid }) => (
        <div className={`${styles.joined} ${invalid ? styles.invalid : ''}`}>
          <span id={prefixId} className={styles.prefix}>
            {copy.prefix}
          </span>
          <Input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={copy.placeholder}
            maxLength={PK_MAX_LENGTH}
            value={phone.pk}
            invalid={invalid}
            aria-describedby={describe('phone', errorId, prefixId, hintId)}
            onChange={(event) => setPhone({ pk: phoneTyped(event.target.value, PK_MAX_LENGTH) })}
            className={styles.input}
          />
        </div>
      )}
    </FormField>
  );

  const abroad = (
    <FormField id={fieldId('phone-group')} kind="group" label={copy.label} hint={copy.hint} error={error} className={styles.field}>
      {({ hintId, errorId }) => (
        <div className={`${styles.joined} ${fieldInvalid(errors, 'countryCode') ? styles.invalid : ''}`}>
          <span className={styles.prefix} aria-hidden="true">
            +
          </span>
          <Input
            id={fieldId('countryCode')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-country-code"
            aria-label={copy.countryCode}
            maxLength={CODE_MAX_LENGTH}
            value={phone.code}
            invalid={fieldInvalid(errors, 'countryCode')}
            aria-describedby={describe('countryCode', errorId, hintId)}
            onChange={(event) => setPhone({ code: phoneTyped(event.target.value, CODE_MAX_LENGTH).trim() })}
            className={`${styles.input} ${styles.code}`}
          />
          <Input
            id={fieldId('number')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            aria-label={copy.number}
            value={phone.number}
            invalid={fieldInvalid(errors, 'number')}
            aria-describedby={describe('number', errorId, hintId)}
            onChange={(event) => setPhone({ number: phoneTyped(event.target.value) })}
            className={styles.number}
          />
        </div>
      )}
    </FormField>
  );

  return (
    <div className={styles.phone}>
      {phone.mode === 'pk' ? pakistani : abroad}
      <TextLink variant="button" onClick={switchPhoneMode}>
        {phone.mode === 'pk' ? copy.abroad : copy.pakistani}
      </TextLink>
    </div>
  );
}
