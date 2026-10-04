'use client';

import { PlannerProgress } from '@/components/planner/PlannerProgress/PlannerProgress';
import { PlannerSuccess } from '@/components/planner/PlannerSuccess/PlannerSuccess';
import { StepDetails } from '@/components/planner/StepDetails/StepDetails';
import { StepNav } from '@/components/planner/StepNav/StepNav';
import { StepReview } from '@/components/planner/StepReview/StepReview';
import { StepWhereWhen } from '@/components/planner/StepWhereWhen/StepWhereWhen';
import { StepWhosComing } from '@/components/planner/StepWhosComing/StepWhosComing';
import { REVIEW, STEP_COUNT, SUCCESS, usePlanner } from '@/hooks/usePlanner';
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
  const { step, direction, next, back, progressRef, formRef, barRef, bodyRef } = usePlanner();
  const titles = [copy.steps.whereWhen, copy.steps.whosComing, copy.steps.details];
  const first = step === 1;
  const progress = step === REVIEW ? copy.progress.review : fillTokens(copy.progress.step, { step: String(step), title: titles[step - 1] ?? '' });

  return (
    <div data-surface="light" className={styles.page}>
      <PageHeader
        variant={first ? 'planner' : 'plannerSlim'}
        headline={first ? copy.header.headline : copy.header.slim}
        lead={first ? copy.header.lead : undefined}
      />
      <div className={styles.layout}>
        <div ref={formRef} className={styles.form}>
          {step !== SUCCESS && (
            <div ref={barRef} className={styles.bar}>
              <PlannerProgress ref={progressRef} text={progress} total={STEP_COUNT} filled={Math.min(step, STEP_COUNT)} />
            </div>
          )}
          <div ref={bodyRef} key={step} className={styles.body} data-direction={direction ?? undefined}>
            {step === 1 && <StepWhereWhen destinations={destinations} copy={copy.whereWhen} />}
            {step === 2 && <StepWhosComing copy={copy.whosComing} />}
            {step === 3 && <StepDetails copy={copy.details} />}
            {step === REVIEW && <StepReview copy={copy.review} steps={copy.steps} backLabel={copy.nav.back} />}
            {step === SUCCESS && <PlannerSuccess copy={copy.success} />}
          </div>
          {step <= STEP_COUNT && (
            <StepNav
              backLabel={first ? undefined : copy.nav.back}
              nextLabel={step < STEP_COUNT ? fillTokens(copy.nav.next, { title: titles[step] }) : copy.nav.review}
              onBack={back}
              onNext={next}
            />
          )}
        </div>
      </div>
    </div>
  );
}
