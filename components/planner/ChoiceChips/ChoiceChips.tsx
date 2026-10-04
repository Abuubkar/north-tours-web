import { FormField } from '@/components/ui/FormField/FormField';
import { Chip } from '@/components/ui/Chip/Chip';
import type { ChoiceChipsProps } from './ChoiceChips.types';
import styles from './ChoiceChips.module.css';

/**
 * A planner question answered with one chip (Trip length, Group type, Best time…): a named group
 * of toggle chips, the chosen one pressed, with the shared selected state.
 */
export function ChoiceChips<T extends string>({ id, label, hint, options, value, onPick }: ChoiceChipsProps<T>) {
  return (
    <FormField id={id} kind="group" label={label} hint={hint}>
      {() => (
        <div className={styles.chips}>
          {options.map((option) => (
            <Chip key={option.id} variant="toggle" pressed={value === option.id} onClick={() => onPick(option.id)}>
              {option.label}
            </Chip>
          ))}
        </div>
      )}
    </FormField>
  );
}
