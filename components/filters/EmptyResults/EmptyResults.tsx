import { Button } from '@/components/ui/Button/Button';
import { routes } from '@/lib/routes';
import type { EmptyResultsProps } from './EmptyResults.types';
import styles from './EmptyResults.module.css';

/** When no trip matches: the fixed headline (DESIGN.md §6), a way back to every trip, and a private trip. */
export function EmptyResults({ copy, onClear }: EmptyResultsProps) {
  return (
    <div className={styles.empty}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <p className={styles.lead}>{copy.lead}</p>
      <div className={styles.actions}>
        <Button onClick={onClear}>{copy.clearLabel}</Button>
        <Button href={routes.plan} variant="secondary">
          {copy.planLabel}
        </Button>
      </div>
    </div>
  );
}
