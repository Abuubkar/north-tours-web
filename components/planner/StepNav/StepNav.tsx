import { Button } from '@/components/ui/Button/Button';
import type { StepNavProps } from './StepNav.types';
import styles from './StepNav.module.css';

/**
 * Under a step: Back (quiet, as navigation; from step 2) and Next (primary, naming the step it
 * goes to) after a hairline. Never animated.
 */
export function StepNav({ backLabel, nextLabel, onBack, onNext }: StepNavProps) {
  return (
    <div className={styles.nav}>
      {backLabel && (
        <Button variant="quiet" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      <Button arrow onClick={onNext} className={styles.next}>
        {nextLabel}
      </Button>
    </div>
  );
}
