'use client';

import { PlannerAside } from '@/components/planner/PlannerAside/PlannerAside';
import { PlannerBottomBar } from '@/components/planner/PlannerBottomBar/PlannerBottomBar';
import { PlannerProgress } from '@/components/planner/PlannerProgress/PlannerProgress';
import { PlannerSuccess } from '@/components/planner/PlannerSuccess/PlannerSuccess';
import { PlannerSummaryBar } from '@/components/planner/PlannerSummaryBar/PlannerSummaryBar';
import { StepDetails } from '@/components/planner/StepDetails/StepDetails';
import { StepNav } from '@/components/planner/StepNav/StepNav';
import { StepReview } from '@/components/planner/StepReview/StepReview';
import { StepWhereWhen } from '@/components/planner/StepWhereWhen/StepWhereWhen';
import { StepWhosComing } from '@/components/planner/StepWhosComing/StepWhosComing';
import { WhatHappensNext } from '@/components/planner/WhatHappensNext/WhatHappensNext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { REVIEW, STEP_COUNT, SUCCESS, usePlanner } from '@/hooks/usePlanner';
import { barLabel, WIDE_LAYOUT_QUERY } from '@/lib/utils/plannerBar';
import { fillTokens } from '@/lib/utils/tokens';
import { PageHeader } from '../PageHeader/PageHeader';
import type { TripPlannerProps } from './TripPlanner.types';
import styles from './TripPlanner.module.css';

/**
 * The Trip Planner (PRD #71), on the dark surface like the rest of the site (owner feedback): step
 * 1 opens on a photo band, later steps on a slim line. From 1100px the form has the "Your trip so
 * far" postcard beside it and its progress sticks in the form; below that a summary bar sticks
 * under the header (with the progress) and Back and Next sit in a frosted bar at the bottom. Only
 * the step body slides when the step changes; the bars and buttons never move.
 */
export function TripPlanner({ copy, destinations, barWords }: TripPlannerProps) {
  const { step, direction, answers, sendHref, next, back, sent, progressRef, barProgressRef, formRef, barRef, summaryBarRef, bodyRef } = usePlanner();
  // Where the progress goes: unknown while hydrating, so both render and CSS shows the right one.
  const wide = useMediaQuery(WIDE_LAYOUT_QUERY, null);
  const titles = [copy.steps.whereWhen, copy.steps.whosComing, copy.steps.details];
  const first = step === 1;
  const done = step === SUCCESS;
  const text = step === REVIEW ? copy.progress.review : fillTokens(copy.progress.step, { step: String(step), title: titles[step - 1] ?? '' });
  const filled = Math.min(step, STEP_COUNT);
  const nextLabel = step < STEP_COUNT ? fillTokens(copy.nav.next, { title: titles[step] }) : copy.nav.review;
  const backLabel = first ? undefined : copy.nav.back;

  return (
    <div className={styles.page}>
      {first ? (
        <PageHeader variant="planner" image={copy.header.image} headline={copy.header.headline} lead={copy.header.lead} />
      ) : (
        <PageHeader variant="plannerSlim" headline={copy.header.slim} />
      )}
      {/* Below 1100px: under the header, sticking under the site header once scrolled to. */}
      {!done && wide !== true && (
        <PlannerSummaryBar ref={summaryBarRef} label={barLabel(answers, barWords)} copy={copy.aside}>
          {/* Below 1100px the progress sits in the bar, which is hidden from 1100px. */}
          <PlannerProgress ref={barProgressRef} text={text} total={STEP_COUNT} filled={filled} />
        </PlannerSummaryBar>
      )}
      <div className={styles.layout}>
        <div ref={formRef} className={styles.form}>
          {!done && wide !== false && (
            <div ref={barRef} data-surface="dark" className={styles.bar}>
              <PlannerProgress ref={progressRef} text={text} total={STEP_COUNT} filled={filled} />
            </div>
          )}
          <div ref={bodyRef} key={step} className={styles.body} data-direction={direction ?? undefined}>
            {step === 1 && <StepWhereWhen destinations={destinations} copy={copy.whereWhen} />}
            {step === 2 && <StepWhosComing copy={copy.whosComing} />}
            {step === 3 && <StepDetails copy={copy.details} />}
            {step === REVIEW && <StepReview copy={copy.review} steps={copy.steps} backLabel={copy.nav.back} />}
            {done && <PlannerSuccess copy={copy.success} />}
          </div>
          {step <= STEP_COUNT && (
            <div className={styles.wideOnly}>
              <StepNav backLabel={backLabel} nextLabel={nextLabel} onBack={back} onNext={next} />
            </div>
          )}
        </div>
        {!done && <PlannerAside copy={copy.aside} next={copy.next} destinations={destinations} barWords={barWords} />}
      </div>
      {!done && (
        <>
          <div className={styles.nextBelow}>
            <WhatHappensNext copy={copy.next} />
          </div>
          <PlannerBottomBar
            backLabel={backLabel}
            nextShort={step === STEP_COUNT ? copy.nav.review : copy.nav.nextShort}
            nextLabel={nextLabel}
            send={step === REVIEW ? { label: copy.review.send, href: sendHref } : undefined}
            onBack={back}
            onNext={next}
            onSend={sent}
          />
        </>
      )}
    </div>
  );
}
