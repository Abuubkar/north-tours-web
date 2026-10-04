import { createContext, use, useCallback, useId, useMemo, useRef, useState, type RefObject } from 'react';
import type { PlannerCopy } from '@/lib/content/pages';
import { DEFAULT_ANSWERS, type TripAnswers } from '@/lib/utils/plannerAnswers';
import { destinationChoices, monthChoices } from '@/lib/utils/plannerOptions';
import { whereWhenErrors, whosComingErrors, type FieldProblem } from '@/lib/utils/plannerValidation';
import { usePlannerFocus, type FocusRequest } from './usePlannerFocus';
import { useToday } from './useToday';

/** Where and when, Who's coming, Your details. */
export type PlannerStep = 1 | 2 | 3;

export const STEP_COUNT = 3;

/** The Trip Planner's one state, shared by the steps, the progress and the navigation. */
export type Planner = {
  /** Today in Pakistan (YYYY-MM-DD): the build's date while hydrating, then the browser's. */
  today: string;
  /** Destination slugs in the loader's order then "unsure", and the 12 months from this one. */
  choices: { destinations: string[]; months: string[] };
  answers: TripAnswers;
  step: PlannerStep;
  /** Which way the last step change went, so the new step slides in from that side; null on arrival. */
  direction: 'forward' | 'back' | null;
  /** The step's problems once the visitor has tried to leave it; they update as the answers change. */
  errors: FieldProblem[];
  update: (change: (answers: TripAnswers) => TripAnswers) => void;
  /** Checks the step: moves on, or shows its problems and takes the visitor to the first. */
  next: () => void;
  /** The step before, every answer kept. */
  back: () => void;
  /** A control's id from its field's name ("from", "age-0"), so the first problem can be focused. */
  fieldId: (field: string) => string;
  /** The progress heading, which takes focus after a step change. */
  progressRef: RefObject<HTMLHeadingElement | null>;
  /** The form column, brought back into view after a step change. */
  formRef: RefObject<HTMLDivElement | null>;
  /** The sticky bar holding the progress: fields scroll to just below it. */
  barRef: RefObject<HTMLDivElement | null>;
};

/** What Next checks on each step. */
function stepProblems(step: PlannerStep, answers: TripAnswers, today: string, messages: PlannerCopy['errors']): FieldProblem[] {
  if (step === 1) return whereWhenErrors(answers, today, messages);
  if (step === 2) return whosComingErrors(answers, messages);
  return [];
}

export const PlannerContext = createContext<Planner | null>(null);

/** The planner from the nearest `PlannerProvider`. */
export function usePlanner(): Planner {
  const planner = use(PlannerContext);
  if (!planner) throw new Error('usePlanner needs a PlannerProvider above it');
  return planner;
}

/**
 * The Trip Planner's state (PRD #71): the answers, the step and the steps the visitor has tried
 * to leave. The rules (options, validation) are pure functions in lib/utils; scrolling and focus
 * live in `usePlannerFocus`. `destinations` are slugs in the loader's order, `messages` the
 * page's error wording.
 */
export function usePlannerState(destinations: readonly string[], builtOn: string, messages: PlannerCopy['errors']): Planner {
  const today = useToday(builtOn);
  const [answers, setAnswers] = useState<TripAnswers>(DEFAULT_ANSWERS);
  const [step, setStep] = useState<PlannerStep>(1);
  const [direction, setDirection] = useState<Planner['direction']>(null);
  const [tried, setTried] = useState<Partial<Record<PlannerStep, boolean>>>({});
  const [focus, setFocus] = useState<FocusRequest | null>(null);
  const progressRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const base = useId();
  const fieldId = useCallback((field: string) => `${base}-${field}`, [base]);
  usePlannerFocus(focus, { fieldId, progressRef, formRef, barRef });
  const update = useCallback((change: (answers: TripAnswers) => TripAnswers) => setAnswers(change), []);

  const choices = useMemo(
    () => ({ destinations: destinationChoices(destinations), months: monthChoices(today) }),
    [destinations, today],
  );
  const problems = stepProblems(step, answers, today, messages);

  function go(to: PlannerStep, way: 'forward' | 'back') {
    setStep(to);
    setDirection(way);
    setFocus({ target: 'progress' });
  }

  return {
    today,
    choices,
    answers,
    step,
    direction,
    errors: tried[step] ? problems : [],
    update,
    next() {
      if (problems.length > 0) {
        setTried((was) => ({ ...was, [step]: true }));
        setFocus({ target: 'field', field: problems[0].fields[0] });
        return;
      }
      if (step < STEP_COUNT) go((step + 1) as PlannerStep, 'forward');
    },
    back() {
      if (step > 1) go((step - 1) as PlannerStep, 'back');
    },
    fieldId,
    progressRef,
    formRef,
    barRef,
  };
}
