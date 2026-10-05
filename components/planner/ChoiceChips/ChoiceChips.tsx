import { FormField } from '@/components/ui/FormField/FormField';
import { Chip } from '@/components/ui/Chip/Chip';
import type { ChoiceChipsProps } from './ChoiceChips.types';
import styles from './ChoiceChips.module.css';

/**
 * A planner question answered with chips (Trip length, Group type, Hotels…): a named group of
 * toggle chips (`aria-pressed`), each picked one pressed, with the shared selected state. Most
 * questions take several; Departing from takes one.
 */
export function ChoiceChips<T extends string>({ id, label, hint, options, value, onPick, children }: ChoiceChipsProps<T>) {
  return (
    <FormField id={id} kind="group" label={label} hint={hint}>
      {() => (
        <>
          <div className={styles.chips}>
            {options.map((option) => (
              <Chip key={option.id} variant="toggle" pressed={value.includes(option.id)} onClick={() => onPick(option.id)}>
                {option.label}
              </Chip>
            ))}
          </div>
          {children}
        </>
      )}
    </FormField>
  );
}
