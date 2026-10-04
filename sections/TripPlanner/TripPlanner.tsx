'use client';

import { PlannerProgress } from '@/components/planner/PlannerProgress/PlannerProgress';
import { StepNav } from '@/components/planner/StepNav/StepNav';
import { StepWhereWhen } from '@/components/planner/StepWhereWhen/StepWhereWhen';
import { STEP_COUNT, usePlanner } from '@/hooks/usePlanner';
import { fillTokens } from '@/lib/utils/tokens';
import { PageHeader } from '../PageHeader/PageHeader';
import type { TripPlannerProps } from './TripPlanner.types';
import styles from './TripPlanner.module.css';

/**
 * The Trip Planner (PRD #71): a light page between the dark header and footer. The header's
 * <h1> follows the step, the progress sticks under the site header, and only the step body
 * slides when the step changes; the progress and the buttons never move.
 */
export function TripPlanner({ copy, destinations }: TripPlannerProps) {
  const { step, direction, next, back, progressRef, formRef, barRef } = usePlanner();
  const titles = [copy.steps.whereWhen, copy.steps.whosComing, copy.steps.details];
  const first = step === 1;

  return (
    <div data-surface="light" className={styles.page}>
      <PageHeader
        variant={first ? 'planner' : 'plannerSlim'}
        headline={first ? copy.header.headline : copy.header.slim}
        lead={first ? copy.header.lead : undefined}
      />
      <div className={styles.layout}>
        <div ref={formRef} className={styles.form}>
          <div ref={barRef} className={styles.bar}>
            <PlannerProgress ref={progressRef} text={fillTokens(copy.progress.step, { step: String(step), title: titles[step - 1] })} filled={step} />
          </div>
          <div key={step} className={styles.body} data-direction={direction ?? undefined}>
            {step === 1 && <StepWhereWhen destinations={destinations} copy={copy.whereWhen} />}
          </div>
          {step < STEP_COUNT && (
            <StepNav
              backLabel={first ? undefined : copy.nav.back}
              nextLabel={fillTokens(copy.nav.next, { title: titles[step] })}
              onBack={back}
              onNext={next}
            />
          )}
        </div>
      </div>
    </div>
  );
}
