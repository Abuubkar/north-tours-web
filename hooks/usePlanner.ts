import { createContext, use, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import type { PlannerCopy } from '@/lib/content/pages';
import { DEFAULT_ANSWERS, type TripAnswers } from '@/lib/utils/plannerAnswers';
import { EMPTY_DETAILS, switchPhoneMode, type Details } from '@/lib/utils/plannerDetails';
import { callBackMessage, tripRequestMessage, type PlannerTemplates } from '@/lib/utils/plannerMessage';
import { destinationChoices, monthChoices } from '@/lib/utils/plannerOptions';
import {
  linksDestination,
  parsePlanner,
  PLANNER_PENDING,
  PLANNER_STORAGE_KEY,
  searchWithoutDestination,
  serialisePlanner,
  withLinkedDestination,
} from '@/lib/utils/plannerStorage';
import { detailsSummary, tripSummary, type DetailsSummary, type SummaryWords, type TripSummary } from '@/lib/utils/plannerSummary';
import { stepErrors, type FieldProblem } from '@/lib/utils/plannerValidation';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { usePlannerFocus, type FocusRequest } from './usePlannerFocus';
import { useToday } from './useToday';

/** The three questions' steps (Where and when, Who's coming, Your details). */
export const STEP_COUNT = 3;
/** Review · Check and send. */
export const REVIEW = 4;
/** "Thanks, Ayesha." */
export const SUCCESS = 5;

export type QuestionStep = 1 | 2 | 3;
export type PlannerStep = QuestionStep | typeof REVIEW | typeof SUCCESS;

/** What the planner needs from the page: the choices, the words and where the messages go. */
export type PlannerConfig = {
  /** Destination slugs in the loader's order. */
  destinations: readonly string[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi). */
  builtOn: string;
  /** The page's error messages. */
  messages: PlannerCopy['errors'];
  /** The words the summary is written in. */
  words: SummaryWords;
  /** The WhatsApp message templates (settings). */
  templates: PlannerTemplates;
  /** The WhatsApp number (settings; a placeholder sends to no number). */
  whatsappNumber: string;
};

/** The Trip Planner's one state, shared by the steps, the review, the progress and the navigation. */
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
  /** Your details: in memory only, never stored. */
  details: Details;
  updateDetails: (change: (details: Details) => Details) => void;
  /** "Outside Pakistan?" / "Pakistani number?": focus moves to the new field, whose message waits for the next Next. */
  togglePhoneMode: () => void;
  /** The answers in words, as the review, the side column and the message show them. */
  trip: TripSummary;
  contact: DetailsSummary;
  /** The trip request, as the preview shows it and "Send on WhatsApp" sends it. */
  message: string;
  sendHref: string;
  callBackHref: string;
  /** Checks the step: moves on, or shows its problems and takes the visitor to the first. */
  next: () => void;
  /** The step before, every answer kept. */
  back: () => void;
  /** From the review: that step, with focus on its first field. */
  edit: (step: QuestionStep) => void;
  /** A WhatsApp link was followed: the thank-you, with focus on it. */
  sent: () => void;
  /** "Plan another trip": everything cleared, back to step 1. */
  restart: () => void;
  /** A control's id from its field's name ("from", "age-0"), so the first problem can be focused. */
  fieldId: (field: string) => string;
  /** The progress heading, which takes focus after a step change: in the form column from 1100px… */
  progressRef: RefObject<HTMLHeadingElement | null>;
  /** …and in the summary bar below 1100px. */
  barProgressRef: RefObject<HTMLHeadingElement | null>;
  /** The form column, brought back into view after a step change. */
  formRef: RefObject<HTMLDivElement | null>;
  /** The sticky bar holding the progress (from 1100px): fields scroll to just below it… */
  barRef: RefObject<HTMLDivElement | null>;
  /** …or the summary bar (below 1100px), open or closed. */
  summaryBarRef: RefObject<HTMLDivElement | null>;
  /** The step's body, whose first field takes focus after Edit. */
  bodyRef: RefObject<HTMLDivElement | null>;
  /** "Thanks, Ayesha.", which takes focus on arrival. */
  successRef: RefObject<HTMLHeadingElement | null>;
};

/** What the page arrived with: the saved answers (if storage can be read) and the link's query. */
type Arrival = { saved: string | null; search: string };

function readArrival(): Arrival {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(PLANNER_STORAGE_KEY);
  } catch {
    // Storage can't be read (private mode, blocked): the planner starts fresh and works in memory.
  }
  return { saved, search: window.location.search };
}

/** Writes the trip answers and step; storage errors (private mode, a full quota) are ignored. */
function save(answers: TripAnswers, step: number) {
  try {
    window.localStorage.setItem(PLANNER_STORAGE_KEY, serialisePlanner(answers, step));
  } catch {
    // The planner keeps working in memory.
  }
}

function forget() {
  try {
    window.localStorage.removeItem(PLANNER_STORAGE_KEY);
  } catch {
    // Nothing to remove if storage can't be reached.
  }
}

/** The arrival isn't watched: it's read once, after hydration. */
const noUpdates = () => () => {};

export const PlannerContext = createContext<Planner | null>(null);

/** The planner from the nearest `PlannerProvider`. */
export function usePlanner(): Planner {
  const planner = use(PlannerContext);
  if (!planner) throw new Error('usePlanner needs a PlannerProvider above it');
  return planner;
}

/**
 * The Trip Planner's state (PRD #71): the answers, your details, the step and the steps the
 * visitor has tried to leave. The rules (options, validation, summary, messages, saved answers)
 * are pure functions in lib/utils; scrolling and focus live in `usePlannerFocus`.
 *
 * Saved answers (ADR-0018): the page is built showing step 1. After hydration the saved trip and
 * step are read once and checked, a `?dest=` link adds its destination (and leaves the address
 * bar), and every change to the trip or step is written at once. Your details are never written.
 */
export function usePlannerState({ destinations, builtOn, messages, words, templates, whatsappNumber }: PlannerConfig): Planner {
  const today = useToday(builtOn);
  // Saved answers and the link: none while hydrating, so the first render matches the built HTML.
  const arrivalRef = useRef<Arrival | null>(null);
  const getArrival = useCallback(() => (arrivalRef.current ??= readArrival()), []);
  const arrival = useSyncExternalStore(noUpdates, getArrival, () => null);
  const restored = useMemo(() => {
    if (!arrival) return null;
    const saved = parsePlanner(arrival.saved, { destinations, today, messages });
    const answers = withLinkedDestination(saved.answers, arrival.search, destinations);
    return { answers, step: saved.step, linked: answers !== saved.answers };
  }, [arrival, destinations, today, messages]);
  const start = restored?.answers ?? DEFAULT_ANSWERS;
  // The visitor's own changes, from the first one on; until then, what was restored.
  const [chosen, setAnswers] = useState<TripAnswers | null>(null);
  const [chosenStep, setStep] = useState<PlannerStep | null>(null);
  const answers = chosen ?? start;
  const step = chosenStep ?? restored?.step ?? 1;
  /** Off after "Plan another trip", so the cleared planner isn't saved until the visitor answers again. */
  const [saving, setSaving] = useState(true);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [direction, setDirection] = useState<Planner['direction']>(null);
  const [tried, setTried] = useState<Partial<Record<PlannerStep, boolean>>>({});
  /** After switching the phone's mode, its message hides until the next Next. */
  const [hidePhoneError, setHidePhoneError] = useState(false);
  const [focus, setFocus] = useState<FocusRequest | null>(null);
  const progressRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barProgressRef = useRef<HTMLHeadingElement>(null);
  const summaryBarRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const base = useId();
  const fieldId = useCallback((field: string) => `${base}-${field}`, [base]);
  const progressRefs = useMemo(() => [progressRef, barProgressRef], []);
  const barRefs = useMemo(() => [barRef, summaryBarRef], []);
  usePlannerFocus(focus, { fieldId, progressRefs, formRef, barRefs, bodyRef, successRef });
  const update = useCallback(
    (change: (answers: TripAnswers) => TripAnswers) => {
      setAnswers((was) => change(was ?? start));
      setSaving(true);
    },
    [start],
  );

  // Once arrived: a linked destination leaves the address bar (no history entry, so a reload
  // doesn't add it again) and is saved; then the planner shows, restored, in this same paint.
  const arrived = useRef(false);
  useLayoutEffect(() => {
    if (!arrival || !restored || arrived.current) return;
    arrived.current = true;
    if (linksDestination(arrival.search)) {
      const { pathname, hash } = window.location;
      window.history.replaceState(window.history.state, '', `${pathname}${searchWithoutDestination(arrival.search)}${hash}`);
      if (restored.linked) save(restored.answers, restored.step);
    }
    document.documentElement.removeAttribute(PLANNER_PENDING);
  }, [arrival, restored]);

  // Every change to the trip or the step is saved at once (never your details).
  useEffect(() => {
    if (saving && (chosen !== null || chosenStep !== null)) save(answers, step);
  }, [saving, chosen, chosenStep, answers, step]);
  const updateDetails = useCallback((change: (details: Details) => Details) => setDetails(change), []);

  const choices = useMemo(
    () => ({ destinations: destinationChoices(destinations), months: monthChoices(today) }),
    [destinations, today],
  );
  const problems = stepErrors(step, answers, details, today, messages);
  const shown = hidePhoneError ? problems.filter((problem) => problem.group !== 'phone') : problems;
  const trip = tripSummary(answers, words);
  const contact = detailsSummary(details, words);
  const message = tripRequestMessage(templates, trip, contact);

  function go(to: PlannerStep, way: 'forward' | 'back', then: FocusRequest = { target: 'progress' }) {
    setStep(to);
    setSaving(true);
    setDirection(way);
    setFocus(then);
  }

  return {
    today,
    choices,
    answers,
    step,
    direction,
    errors: tried[step] ? shown : [],
    update,
    details,
    updateDetails,
    togglePhoneMode() {
      setDetails(switchPhoneMode);
      setHidePhoneError(true);
      setFocus({ target: 'field', field: details.phone.mode === 'pk' ? 'countryCode' : 'phone', scroll: false });
    },
    trip,
    contact,
    message,
    sendHref: whatsappLink(whatsappNumber, message),
    callBackHref: whatsappLink(whatsappNumber, callBackMessage(templates, trip, contact)),
    next() {
      setHidePhoneError(false);
      if (problems.length > 0) {
        setTried((was) => ({ ...was, [step]: true }));
        setFocus({ target: 'field', field: problems[0].fields[0] });
        return;
      }
      if (step <= STEP_COUNT) go((step + 1) as PlannerStep, 'forward');
    },
    back() {
      if (step > 1 && step <= REVIEW) go((step - 1) as PlannerStep, 'back');
    },
    edit: (to) => go(to, 'back', { target: 'first' }),
    sent: () => go(SUCCESS, 'forward', { target: 'success' }),
    restart() {
      setAnswers(DEFAULT_ANSWERS);
      setDetails(EMPTY_DETAILS);
      setTried({});
      go(1, 'back');
      // Not saved again until the visitor answers something.
      setSaving(false);
      forget();
    },
    fieldId,
    progressRef,
    barProgressRef,
    formRef,
    barRef,
    summaryBarRef,
    bodyRef,
    successRef,
  };
}
