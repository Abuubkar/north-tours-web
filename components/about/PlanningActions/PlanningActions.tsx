import { Button } from '@/components/ui/Button/Button';
import { routes } from '@/lib/routes';
import type { PlanningActionsProps } from './PlanningActions.types';
import styles from './PlanningActions.module.css';

/** About's closing pair: "Explore tours →" (primary) and "Plan a private trip" (secondary, no icon), both 56px. */
export function PlanningActions({ exploreLabel, planLabel }: PlanningActionsProps) {
  return (
    <div className={styles.actions}>
      <Button href={routes.tours} size={56} arrow className={styles.action}>
        {exploreLabel}
      </Button>
      <Button href={routes.plan} variant="secondary" size={56} className={styles.action}>
        {planLabel}
      </Button>
    </div>
  );
}
