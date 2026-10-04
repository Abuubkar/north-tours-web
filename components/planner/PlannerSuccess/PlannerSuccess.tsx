'use client';

import { Button } from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/Icon/Icon';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { usePlanner } from '@/hooks/usePlanner';
import { routes } from '@/lib/routes';
import { firstName } from '@/lib/utils/plannerDetails';
import { fillTokens } from '@/lib/utils/tokens';
import type { PlannerSuccessProps } from './PlannerSuccess.types';
import styles from './PlannerSuccess.module.css';

const CHECK_SIZE = 20;

/**
 * After a WhatsApp link is followed: "Thanks, Ayesha." (focused on arrival), what happens next,
 * the ways on, and "Plan another trip", which starts a clean planner.
 */
export function PlannerSuccess({ copy }: PlannerSuccessProps) {
  const { details, successRef, restart } = usePlanner();
  return (
    <div className={styles.success}>
      <span className={styles.check} aria-hidden="true">
        <Icon name="check" size={CHECK_SIZE} />
      </span>
      <h2 ref={successRef} tabIndex={-1} className={styles.headline}>
        {fillTokens(copy.headline, { firstName: firstName(details) })}
      </h2>
      <p className={styles.line}>{copy.line}</p>
      <div className={styles.actions}>
        <Button href={routes.tours} arrow>
          {copy.browse}
        </Button>
        <Button href={routes.destinations} variant="secondary">
          {copy.explore}
        </Button>
      </div>
      <TextLink variant="button" onClick={restart}>
        {copy.again}
      </TextLink>
    </div>
  );
}
