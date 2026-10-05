import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { opacityUpTo } from '../../.storybook/opacity';
import { realUser } from '../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import { noSavedPlanner, sampleAnswers, sampleBarWords, samplePlannerCopy, samplePlannerDestinations, savedPlanner, withPlanner } from '@/components/planner/samplePlanner';
import { atQuery } from '../../.storybook/storyUrl';
import type { TripAnswers } from '@/lib/utils/plannerAnswers';
import { monthChoices } from '@/lib/utils/plannerOptions';
import { PLANNER_STORAGE_KEY, serialisePlanner } from '@/lib/utils/plannerStorage';
import { shortMonthsYears } from '@/lib/utils/dates';
import { todayInKarachi } from '@/lib/utils/departures';
import { TripPlanner } from './TripPlanner';

const meta = {
  title: 'Sections/TripPlanner',
  component: TripPlanner,
  args: { copy: samplePlannerCopy, destinations: samplePlannerDestinations, barWords: sampleBarWords },
  decorators: [withPlanner],
  // Reduced motion by default (story files share one page, ADR-0023), put back for the next file afterwards.
  beforeEach: async () => {
    await emulateReducedMotion();
    window.scrollTo({ top: 0, behavior: 'instant' });
    const forget = noSavedPlanner();
    return async () => {
      forget();
      await emulateFullMotion();
    };
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TripPlanner>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

const button = (canvas: Canvas, name: string | RegExp) => canvas.getByRole('button', { name });
/** The progress heading: the one <h2> announced politely (in the form from 1100px, in the summary bar below). */
const progress = (canvas: Canvas) => {
  const headings = canvas.getAllByRole('heading', { level: 2 }).filter((h: HTMLElement) => h.getAttribute('aria-live') === 'polite');
  if (headings.length !== 1) throw new Error(`Expected one progress heading, found ${headings.length}`);
  return headings[0];
};
const monthChips = (canvas: Canvas) => within(canvas.getByRole('group', { name: 'Month' })).getAllByRole('button');
/** The sticky bar holding the progress: the progress bar from 1100px, the summary bar below. */
const bar = (canvas: Canvas) => {
  let element: HTMLElement | null = progress(canvas);
  while (element && getComputedStyle(element).position !== 'sticky') element = element.parentElement;
  return element!;
};

/** Waits for the page to stop scrolling (a smooth scroll takes a few frames). */
async function settled() {
  let last = -1;
  await waitFor(
    async () => {
      const now = window.scrollY;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const moved = now !== last || window.scrollY !== now;
      last = window.scrollY;
      if (moved) throw new Error('still scrolling');
    },
    { timeout: 3000 },
  );
}

/**
 * Step 1, all on the dark surface: one <h1> at the statement size on the photo band (the page's
 * main image), the progress, the questions and Next; nothing scrolls sideways.
 */
export const Step1: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: samplePlannerCopy.header.image.alt })).toHaveAttribute('fetchpriority', 'high');
    await expect(canvasElement.querySelector('[data-surface="light"]')).toBeNull();
    await expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when');
    await expect(canvas.getByRole('group', { name: 'Destinations' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { pressed: false }).length).toBeGreaterThan(7);
    await expect(button(canvas, 'Not sure, suggest something')).toBeVisible();
    await expect(monthChips(canvas)).toHaveLength(12);
    // One Next: in the form from 1100px, in the bottom bar below; short below 820px.
    await expect(canvas.getAllByRole('button', { name: /^Next/ })).toHaveLength(1);
    await expect(button(canvas, /^Next/)).toHaveAccessibleName(window.innerWidth >= 820 ? 'Next: Who’s coming' : 'Next');
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const Step1Laptop: Story = { ...Step1, globals: { viewport: { value: 'laptop' } } };

export const Step1Phone: Story = { ...Step1, globals: { viewport: { value: 'phone' } } };

/** Real keys: Space and Enter toggle a destination card, several can be on, and each reports aria-pressed. */
export const CardsWithKeys: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const hunza = button(canvas, 'Hunza');
    hunza.focus();
    await user.keyboard(' ');
    await expect(hunza).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    await expect(button(canvas, 'Murree')).toHaveAttribute('aria-pressed', 'true');
    await expect(hunza).toHaveAttribute('aria-pressed', 'true');
    hunza.focus();
    await user.keyboard('{Enter}');
    await expect(hunza).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * The date mode switches: Exact shows From and To, neither before today in Karachi, To not
 * before From; Flexible brings the months back. Several months can be picked, and picking one
 * again unpicks it.
 */
export const Dates: Story = {
  play: async ({ canvas, userEvent }) => {
    const today = todayInKarachi(new Date());
    await expect(button(canvas, 'Flexible')).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button(canvas, 'Exact dates'));
    await expect(button(canvas, 'Exact dates')).toHaveAttribute('aria-pressed', 'true');
    const from = canvas.getByLabelText('From');
    await expect(from).toHaveAttribute('type', 'date');
    await expect(from).toHaveAttribute('min', today);
    await expect(canvas.getByLabelText('To')).toHaveAttribute('min', today);
    await expect(canvas.queryByRole('group', { name: 'Month' })).toBeNull();

    await userEvent.click(button(canvas, 'Flexible'));
    const [first, second] = monthChips(canvas);
    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(second);
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(second).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(second);
    await userEvent.click(first);
    await expect(monthChips(canvas).every((chip) => chip.getAttribute('aria-pressed') === 'false')).toBe(true);
  },
};

/** The trip length is asked once: no days stepper, and a month alone leaves the length unpicked until the visitor picks one. */
export const LengthAskedOnce: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole('group', { name: /how many days/i })).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'More days' })).toBeNull();
    const length = canvas.getByRole('group', { name: 'Trip length' });
    await userEvent.click(monthChips(canvas)[3]);
    for (const chip of within(length).getAllByRole('button')) await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(length).toHaveAccessibleDescription('Optional');
    await userEvent.click(button(canvas, '8–10 days'));
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button(canvas, '8–10 days'));
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'false');
  },
};

/** A token's value in pixels, as the page has it. */
const tokenPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

/**
 * A question's label line and its first control: a group's <legend> and the box after it, or a
 * field's label line and the control under it. A question without a label (the privacy line) has neither.
 */
function questionParts(question: HTMLElement) {
  const legend = question.querySelector<HTMLElement>(':scope > legend');
  if (legend) return { label: legend, control: legend.nextElementSibling?.firstElementChild ?? null };
  const head = question.querySelector<HTMLElement>(':scope > div:has(> label)');
  return head ? { label: head, control: head.nextElementSibling } : null;
}

/**
 * One rhythm on every step: from one question's last control, across the hairline, to the next
 * question's first line is the same space everywhere (`--form-question-y` each side of the line),
 * and every label sits `--form-label-gap` above its control, whether the question is one field or a group.
 */
async function expectRhythm(canvasElement: HTMLElement) {
  const body = canvasElement.querySelector<HTMLElement>('[data-form-field]')?.parentElement;
  const questions = body ? ([...body.children] as HTMLElement[]) : [];
  if (questions.length < 2) throw new Error('Expected a step body with at least two questions');
  const space = tokenPx('--form-question-y');
  const hairline = tokenPx('--hairline-width');
  for (const [i, question] of questions.entries()) {
    const parts = questionParts(question);
    const style = getComputedStyle(question);
    const firstLine = parts ? parts.label.getBoundingClientRect().top : question.getBoundingClientRect().top + hairline + parseFloat(style.paddingTop);
    if (i > 0) {
      const before = questions[i - 1];
      const end = before.getBoundingClientRect().bottom - parseFloat(getComputedStyle(before).paddingBottom);
      await expect(Math.round(firstLine - end)).toBe(2 * space + hairline);
      await expect(style.borderTopWidth).toBe(`${hairline}px`);
    }
    if (parts?.control) {
      await expect(Math.round(parts.control.getBoundingClientRect().top - parts.label.getBoundingClientRect().bottom)).toBe(tokenPx('--form-label-gap'));
    }
  }
}

/** Steps 1, 2 and 3 share the rhythm. */
export const Rhythm: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expectRhythm(canvasElement);
    await toStep2(canvas, userEvent);
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming'));
    await expectRhythm(canvasElement);
    await userEvent.click(button(canvas, /^Next/));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 3 of 3 · Your details'));
    await expectRhythm(canvasElement);
  },
};

export const RhythmPhone: Story = { ...Rhythm, globals: { viewport: { value: 'phone' } } };

/**
 * Next on an empty step: both messages show, the first card takes focus and sits below the
 * sticky progress; ticking a card clears its message. With reduced motion the page jumps there.
 */
export const EmptyNext: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(button(canvas, /^Next/));
    await expect(canvas.getByText('Choose at least one destination, or “Not sure, suggest something”.')).toBeVisible();
    await expect(canvas.getByText('Pick a month, or switch to exact dates.')).toBeVisible();
    const first = button(canvas, 'Fairy Meadows');
    await waitFor(() => expect(first).toHaveFocus());
    // Reduced motion: the scroll has already happened, with no smooth scrolling in between.
    const y = window.scrollY;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await expect(window.scrollY).toBe(y);
    await expect(first.getBoundingClientRect().top).toBeGreaterThanOrEqual(bar(canvas).getBoundingClientRect().bottom);
    await expect(first).toHaveAccessibleDescription('Choose at least one destination, or “Not sure, suggest something”.');
    await expect(canvas.getByRole('button', { name: monthChips(canvas)[0].textContent! })).toHaveAccessibleDescription(
      'Pick a month, or switch to exact dates.',
    );
    await userEvent.click(button(canvas, 'Skardu'));
    await expect(canvas.queryByText(/Choose at least one destination/)).toBeNull();
    await expect(canvas.getByText('Pick a month, or switch to exact dates.')).toBeVisible();
  },
};

export const EmptyNextPhone: Story = { ...EmptyNext, globals: { viewport: { value: 'phone' } } };

/** Scrolled down, then a failed Next with full motion: a smooth scroll lands the first card below the bar. */
export const EmptyNextSmooth: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvas, userEvent }) => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    await userEvent.click(button(canvas, /^Next/));
    const first = button(canvas, 'Fairy Meadows');
    await waitFor(() => expect(first).toHaveFocus());
    await settled();
    const top = first.getBoundingClientRect().top;
    await expect(top).toBeGreaterThanOrEqual(bar(canvas).getBoundingClientRect().bottom);
    await expect(top).toBeLessThan(window.innerHeight / 2);
  },
};

export const EmptyNextSmoothPhone: Story = { ...EmptyNextSmooth, globals: { viewport: { value: 'phone' } } };

/** A valid step moves on: focus on the progress, which reads step 2, the slim <h1>; Back keeps every answer. */
export const NextAndBack: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(button(canvas, 'Hunza'));
    await userEvent.click(monthChips(canvas)[5]);
    const month = monthChips(canvas)[5].textContent!;
    await userEvent.click(button(canvas, '8–10 days'));
    await userEvent.click(button(canvas, /^Next/));
    await waitFor(() => expect(progress(canvas)).toHaveFocus());
    await expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming');
    await expect(canvas.getByRole('heading', { level: 1, name: 'Planning your private trip' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    // From step 2 the band goes: the slim line only, so the step change stays calm.
    await expect(canvas.queryByRole('img', { name: samplePlannerCopy.header.image.alt })).toBeNull();
    // From 1100px the postcard shows the place chosen on step 1, on its photo, and the road from Lahore.
    if (window.innerWidth >= 1100) {
      const postcard = within(canvas.getByRole('complementary', { name: 'Your trip so far' }));
      await expect(postcard.getByRole('img', { name: 'A view of Hunza' })).toBeVisible();
      await expect(postcard.getByText('Lahore → Hunza')).toBeVisible();
    }
    await userEvent.click(button(canvas, 'Back'));
    await waitFor(() => expect(progress(canvas)).toHaveFocus());
    await expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when');
    await expect(canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' })).toBeVisible();
    await expect(button(canvas, 'Hunza')).toHaveAttribute('aria-pressed', 'true');
    await expect(button(canvas, month)).toHaveAttribute('aria-pressed', 'true');
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'true');
  },
};

export const NextAndBackPhone: Story = { ...NextAndBack, globals: { viewport: { value: 'phone' } } };

const toStep2 = async (canvas: Canvas, userEvent: { click: (el: Element) => Promise<void> }) => {
  await userEvent.click(button(canvas, 'Hunza'));
  await userEvent.click(monthChips(canvas)[2]);
  await userEvent.click(button(canvas, /^Next/));
};

/** Full motion: only the step body slides, by transform alone; the progress and buttons stay put at full opacity. */
export const StepSlides: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await toStep2(canvas, userEvent);
    const body = canvasElement.querySelector<HTMLElement>('[data-direction]')!;
    const animations = body.getAnimations();
    await expect(animations).toHaveLength(1);
    const keyframes = (animations[0].effect as KeyframeEffect).getKeyframes();
    await expect(keyframes.some((frame) => 'transform' in frame)).toBe(true);
    await expect(keyframes.some((frame) => 'opacity' in frame)).toBe(false);
    for (const control of [progress(canvas), button(canvas, 'Back'), button(canvas, /^Next/)]) {
      await expect(opacityUpTo(control, canvasElement)).toBe(1);
      await expect(control.getAnimations({ subtree: false })).toHaveLength(0);
    }
  },
};

/** Reduced motion: steps simply swap. */
export const StepSwapsReduced: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await toStep2(canvas, userEvent);
    const body = canvasElement.querySelector<HTMLElement>('[data-direction]')!;
    await expect(body.getAnimations()).toHaveLength(0);
  },
};

/** Step 2: Next with a child's age missing shows the message, focuses that select below the bar; an age clears it. */
export const MissingAge: Story = {
  play: async ({ canvas, userEvent }) => {
    await toStep2(canvas, userEvent);
    await userEvent.click(button(canvas, 'More children'));
    await userEvent.click(button(canvas, 'More children'));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Child 1' }), '6');
    await userEvent.click(button(canvas, /^Next/));
    const second = canvas.getByRole('combobox', { name: 'Child 2' });
    await waitFor(() => expect(second).toHaveFocus());
    await expect(second).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('combobox', { name: 'Child 1' })).not.toHaveAttribute('aria-invalid');
    await expect(second).toHaveAccessibleDescription('Add an age for each child.');
    await expect(second.getBoundingClientRect().top).toBeGreaterThanOrEqual(bar(canvas).getBoundingClientRect().bottom);
    await userEvent.selectOptions(second, 'Under 2');
    await expect(canvas.queryByText('Add an age for each child.')).toBeNull();
    await expect(second).not.toHaveAttribute('aria-invalid');
  },
};

export const MissingAgePhone: Story = { ...MissingAge, globals: { viewport: { value: 'phone' } } };

/** Back to step 1 and Next again keep every step 2 answer. */
export const Step2Kept: Story = {
  play: async ({ canvas, userEvent }) => {
    await toStep2(canvas, userEvent);
    await userEvent.click(button(canvas, 'More adults'));
    await userEvent.click(button(canvas, 'More children'));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Child 1' }), '9');
    await userEvent.click(button(canvas, 'Couple'));
    await userEvent.click(button(canvas, 'Other city'));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Other city' }), 'Multan');
    await userEvent.click(button(canvas, 'Back'));
    await userEvent.click(button(canvas, /^Next/));
    await expect(canvas.getByRole('group', { name: 'Adults' })).toHaveTextContent('3');
    await expect(canvas.getByRole('combobox', { name: 'Child 1' })).toHaveDisplayValue('9');
    await expect(button(canvas, 'Couple')).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Other city' })).toHaveValue('Multan');
  },
};

const toStep3 = async (canvas: Canvas, userEvent: { click: (el: Element) => Promise<void> }) => {
  await toStep2(canvas, userEvent);
  await userEvent.click(button(canvas, /^Next/));
};

/** Step 3: Next with nothing filled shows the name and number messages, focuses the name; each input is invalid and described. */
export const DetailsEmpty: Story = {
  play: async ({ canvas, userEvent }) => {
    await toStep3(canvas, userEvent);
    await expect(progress(canvas)).toHaveTextContent('Step 3 of 3 · Your details');
    await userEvent.click(button(canvas, /^Review/));
    const name = canvas.getByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveFocus());
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('Required Add your name so we know who to reply to.');
    const phone = canvas.getByRole('textbox', { name: 'WhatsApp number' });
    await expect(phone).toHaveAttribute('aria-invalid', 'true');
    await expect(phone).toHaveAccessibleDescription('+92 Required Add your WhatsApp number so we can reply.');
    await expect(name.getBoundingClientRect().top).toBeGreaterThanOrEqual(bar(canvas).getBoundingClientRect().bottom);
  },
};

export const DetailsEmptyPhone: Story = { ...DetailsEmpty, globals: { viewport: { value: 'phone' } } };

/**
 * Real keys: the number keeps digits and spaces; "300 12" is incomplete (5 of 10 digits), its
 * message wraps under the field, and it takes focus once the name is filled. Abroad, "44" and
 * "7700 900123" pass; back on Your details, "Pakistani number?" brings back the number as typed.
 */
export const DetailsPhone: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const user = await realUser();
    if (!user) return;
    await toStep3(canvas, userEvent);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
    const phone = canvas.getByRole('textbox', { name: 'WhatsApp number' });
    await user.click(phone);
    await user.keyboard('0300-123 4567x');
    await expect(phone).toHaveValue('0300123 4567');
    await user.clear(phone);
    await user.keyboard('300 12');
    await userEvent.click(button(canvas, /^Review/));
    await waitFor(() => expect(phone).toHaveFocus());
    const message = canvas.getByText(/This number looks incomplete \(5 of 10 digits\)/);
    await expect(message.getBoundingClientRect().top).toBeGreaterThan(phone.getBoundingClientRect().bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    await userEvent.click(button(canvas, 'Outside Pakistan?'));
    const code = canvas.getByRole('textbox', { name: 'Country code' });
    await expect(code).toHaveFocus();
    // The message waits for the next Next.
    await expect(canvas.queryByText(/looks incomplete|country code and number/)).toBeNull();
    await userEvent.type(code, '44');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Number' }), '7700 900123');
    // A valid number abroad passes: on to the review, which shows it in international form.
    await userEvent.click(button(canvas, /^Review/));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Review · Check and send'));
    await expect(canvas.getByText('+44 7700 900123')).toBeVisible();
    await userEvent.click(button(canvas, 'Edit your details'));
    await userEvent.click(button(canvas, 'Pakistani number?'));
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveValue('300 12');
  },
};

export const DetailsPhonePhone: Story = { ...DetailsPhone, globals: { viewport: { value: 'phone' } } };

export const DetailsPhoneLaptop: Story = { ...DetailsPhone, globals: { viewport: { value: 'laptop' } } };

/** Back to step 2 and Next again keep the name, number, best time and notes. */
export const DetailsKept: Story = {
  play: async ({ canvas, userEvent }) => {
    await toStep3(canvas, userEvent);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
    await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123 4567');
    await userEvent.click(button(canvas, 'Evening'));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Anything else?' }), 'Travelling with my mother.');
    await userEvent.click(button(canvas, 'Back'));
    await userEvent.click(button(canvas, /^Next/));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('Ayesha Khan');
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveValue('300 123 4567');
    await expect(button(canvas, 'Evening')).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Anything else?' })).toHaveValue('Travelling with my mother.');
  },
};

/** Keeps the story on the page: a followed wa.me link still runs its click handler, but opens nothing. */
const stayOnPage = () => {
  const block = (event: MouseEvent) => {
    if ((event.target as Element).closest('a[href^="https://wa.me"]')) event.preventDefault();
  };
  document.addEventListener('click', block);
  return () => document.removeEventListener('click', block);
};

/** Every step answered, then Review: Hunza in the fourth month for 5–7 days, 2 adults and 2 children (6, 9), Family, Upgraded, Ayesha. */
const toReview = async (canvas: Canvas, userEvent: { click: (el: Element) => Promise<void>; type: (el: Element, text: string) => Promise<void>; selectOptions: (el: Element, value: string) => Promise<void> }) => {
  await userEvent.click(button(canvas, 'Hunza'));
  await userEvent.click(monthChips(canvas)[3]);
  await userEvent.click(button(canvas, '5–7 days'));
  await userEvent.click(button(canvas, /^Next/));
  await userEvent.click(button(canvas, 'More children'));
  await userEvent.click(button(canvas, 'More children'));
  await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Child 1' }), '6');
  await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Child 2' }), '9');
  await userEvent.click(button(canvas, 'Family'));
  await userEvent.click(button(canvas, 'Upgraded'));
  await userEvent.click(button(canvas, /^Next/));
  await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
  await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123 4567');
  await userEvent.click(button(canvas, 'Evening'));
  await userEvent.click(button(canvas, /^Review/));
};

const linkText = (link: HTMLElement) => new URL(link.getAttribute('href')!).searchParams.get('text');

/**
 * Review: every answer in its section (<h3>s under the progress <h2>), "Not given" for the rest,
 * and the preview is exactly the message "Send on WhatsApp" carries. One <h1>.
 */
export const Review: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await toReview(canvas, userEvent);
    await waitFor(() => expect(progress(canvas)).toHaveFocus());
    await expect(progress(canvas)).toHaveTextContent('Review · Check and send');
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    const sections = canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    await expect(sections).toEqual(['Where and when', 'Who’s coming', 'Your details']);
    const values = canvas.getAllByRole('definition').map((d) => d.textContent);
    for (const value of ['Hunza', '5–7 days', '2 adults, 2 children (ages 6, 9)', 'Family', 'Upgraded', 'Lahore', 'Ayesha Khan', '+92 300 123 4567', 'Evening']) {
      await expect(values).toContain(value);
    }
    await expect(canvas.getAllByText('Not given').map((n) => n.closest('div')!.firstChild!.textContent)).toEqual(['Transport', 'Budget', 'Anything else']);
    const send = canvas.getByRole('link', { name: 'Send on WhatsApp' });
    await expect(send).toHaveAttribute('target', '_blank');
    await expect(send).toHaveAttribute('rel', 'noopener');
    await expect(linkText(send)).toBe(canvasElement.querySelector('figure p')!.textContent);
    await expect(linkText(send)).toContain('• Group: 2 adults, 2 children (ages 6, 9) · Family');
  },
};

export const ReviewPhone: Story = { ...Review, globals: { viewport: { value: 'phone' } } };

/**
 * Several picks (owner feedback, 2026-10-05): two months, two trip lengths, two group types, two
 * hotel levels and two best times, each joined in the review and the WhatsApp message, in the
 * options' order whatever order they were pressed in. Departing from stays one city.
 */
export const ReviewSeveralPicks: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const months = monthChoices(todayInKarachi(new Date())).slice(3, 5);
    await userEvent.click(button(canvas, 'Hunza'));
    await userEvent.click(button(canvas, 'Skardu'));
    await userEvent.click(monthChips(canvas)[4]);
    await userEvent.click(monthChips(canvas)[3]);
    await userEvent.click(button(canvas, '8–10 days'));
    await userEvent.click(button(canvas, '5–7 days'));
    await userEvent.click(button(canvas, /^Next/));
    await userEvent.click(button(canvas, 'Friends'));
    await userEvent.click(button(canvas, 'Family'));
    await userEvent.click(button(canvas, 'Upgraded'));
    await userEvent.click(button(canvas, 'Comfortable'));
    await userEvent.click(button(canvas, 'Islamabad'));
    await userEvent.click(button(canvas, 'Lahore'));
    await expect(canvas.getAllByRole('button', { pressed: true }).map((chip) => chip.textContent)).toEqual(['Family', 'Friends', 'Comfortable', 'Upgraded', 'Lahore']);
    await userEvent.click(button(canvas, /^Next/));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
    await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123 4567');
    await userEvent.click(button(canvas, 'Evening'));
    await userEvent.click(button(canvas, 'Morning'));
    await userEvent.click(button(canvas, /^Review/));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Review · Check and send'));
    const dates = shortMonthsYears(months);
    const values = canvas.getAllByRole('definition').map((d) => d.textContent);
    for (const value of ['Hunza, Skardu', dates, '5–7 days, 8–10 days', 'Family, Friends', 'Comfortable, Upgraded', 'Lahore', 'Morning, Evening']) {
      await expect(values).toContain(value);
    }
    const message = linkText(canvas.getByRole('link', { name: 'Send on WhatsApp' }));
    await expect(message).toBe(canvasElement.querySelector('figure p')!.textContent);
    for (const line of [
      '• Destinations: Hunza, Skardu',
      `• Dates: ${dates} (5–7 days, 8–10 days)`,
      '• Group: 2 adults · Family, Friends',
      '• Hotels: Comfortable, Upgraded · Transport: Any',
      '• Departing from: Lahore',
      '• Best time to reach me: Morning, Evening',
    ]) {
      await expect(message!.split('\n')).toContain(line);
    }
  },
};

export const ReviewSeveralPicksPhone: Story = { ...ReviewSeveralPicks, globals: { viewport: { value: 'phone' } } };

export const ReviewLaptop: Story = { ...Review, globals: { viewport: { value: 'laptop' } } };

/** "Edit who’s coming" opens step 2 with focus on its first field; Next goes on through the steps again. */
export const Edit: Story = {
  play: async ({ canvas, userEvent }) => {
    await toReview(canvas, userEvent);
    await userEvent.click(button(canvas, 'Edit who’s coming'));
    await waitFor(() => expect(button(canvas, 'Fewer adults')).toHaveFocus());
    await expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming');
    await userEvent.click(button(canvas, /^Next/));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('Ayesha Khan');
    await userEvent.click(button(canvas, /^Review/));
    await userEvent.click(button(canvas, 'Edit your details'));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveFocus());
  },
};

/** "Request a call back" asks for a call on the number at the best time, with the trip; following it shows the thank-you. */
export const CallBack: Story = {
  beforeEach: stayOnPage,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await toReview(canvas, userEvent);
    const callBack = canvas.getByRole('link', { name: 'Request a call back' });
    const text = linkText(callBack)!;
    await expect(callBack.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
    await expect(text.split('\n')[0]).toBe('Please call me back on +92 300 123 4567, best time evening.');
    await expect(text).toContain('• Destinations: Hunza');
    await expect(text.split('\n').at(-1)).toBe('Name: Ayesha Khan');
    await userEvent.click(callBack);
    const thanks = canvas.getByRole('heading', { level: 2, name: 'Thanks, Ayesha.' });
    await waitFor(() => expect(thanks).toHaveFocus());
    await expect(canvas.queryByText(/^Step|^Review ·/)).toBeNull();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Planning your private trip' })).toBeVisible();
  },
};

/** "Send on WhatsApp" leads to the thank-you too; "Plan another trip" starts a clean step 1, focus on the progress. */
export const SendAndAgain: Story = {
  beforeEach: stayOnPage,
  play: async ({ canvas, userEvent }) => {
    await toReview(canvas, userEvent);
    await userEvent.click(canvas.getByRole('link', { name: 'Send on WhatsApp' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 2, name: 'Thanks, Ayesha.' })).toHaveFocus());
    await expect(canvas.getByRole('link', { name: 'Browse tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByRole('link', { name: 'Explore destinations' })).toHaveAttribute('href', '/destinations');
    await userEvent.click(button(canvas, 'Plan another trip'));
    await waitFor(() => expect(progress(canvas)).toHaveFocus());
    await expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when');
    await expect(canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' })).toBeVisible();
    await expect(canvas.queryAllByRole('button', { pressed: true }).map((b) => b.textContent)).toEqual(['Flexible']);
    // The details are cleared too.
    await toStep3(canvas, userEvent);
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveValue('');
    await expect(button(canvas, 'Evening')).toHaveAttribute('aria-pressed', 'false');
  },
};

export const SendAndAgainPhone: Story = { ...SendAndAgain, globals: { viewport: { value: 'phone' } } };

export const SendAndAgainLaptop: Story = { ...SendAndAgain, globals: { viewport: { value: 'laptop' } } };

/* Saved answers and the ?dest= link (#76, ADR-0018). */

/** A month the planner still offers, whenever the story runs. */
const comingMonth = () => monthChoices(todayInKarachi(new Date()))[3];

const savedTrip = (step: number, change: Partial<TripAnswers> = {}) =>
  serialisePlanner({ ...sampleAnswers, months: [comingMonth()], ...change }, step);

const saved = () => JSON.parse(localStorage.getItem(PLANNER_STORAGE_KEY) ?? 'null');

/** Counts pushState calls from before the story renders, so a linked destination can be shown to leave no history entry. */
let pushed = 0;
const noNewHistory = () => {
  pushed = 0;
  const { pushState } = window.history;
  window.history.pushState = (...args: Parameters<History['pushState']>) => {
    pushed += 1;
    pushState.apply(window.history, args);
  };
  return () => {
    window.history.pushState = pushState;
  };
};

/** Runs several `beforeEach` steps, and their cleanups after. */
const all =
  (...steps: (() => (() => void) | void | Promise<unknown>)[]) =>
  async () => {
    const cleanups: unknown[] = [];
    for (const step of steps) cleanups.push(await step());
    return () => cleanups.reverse().forEach((cleanup) => typeof cleanup === 'function' && cleanup());
  };

/** Every change writes the trip and step at once, and never the name, number, best time or notes. */
export const Saving: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull();
    await userEvent.click(button(canvas, 'Hunza'));
    await waitFor(() => expect(saved()).toMatchObject({ destinations: ['hunza'], step: 1 }));
    await toStep3Answered(canvas, userEvent);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
    await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123 4567');
    await userEvent.click(button(canvas, 'Evening'));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Anything else?' }), 'A quiet room, please.');
    await waitFor(() => expect(saved()).toMatchObject({ step: 3, adults: 2 }));
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY)!;
    for (const detail of ['Ayesha', '300', 'evening', 'quiet room', '"name"', '"phone"', '"notes"', '"bestTime"']) {
      await expect(raw).not.toContain(detail);
    }
  },
};

const toStep3Answered = async (canvas: Canvas, userEvent: { click: (el: Element) => Promise<void> }) => {
  await userEvent.click(monthChips(canvas)[3]);
  await userEvent.click(button(canvas, /^Next/));
  await userEvent.click(button(canvas, /^Next/));
};

/** Saved on step 2: the planner opens there, with the trip as it was. */
export const SavedStep2: Story = {
  beforeEach: () => savedPlanner(savedTrip(2))(),
  play: async ({ canvas }) => {
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming'));
    await expect(canvas.getByRole('combobox', { name: 'Child 2' })).toHaveDisplayValue('9');
    await expect(button(canvas, 'Family')).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('heading', { level: 1, name: 'Planning your private trip' })).toBeVisible();
  },
};

/** Saved on the review: details were never saved, so it opens on Your details, the trip kept and the details empty. */
export const SavedReview: Story = {
  beforeEach: () => savedPlanner(savedTrip(4))(),
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 3 of 3 · Your details'));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveValue('');
    await userEvent.click(button(canvas, 'Back'));
    await expect(button(canvas, 'Upgraded')).toHaveAttribute('aria-pressed', 'true');
  },
};

export const SavedReviewPhone: Story = { ...SavedReview, globals: { viewport: { value: 'phone' } } };

/** Saved junk: a past month and a destination no longer in content fall back to their defaults; the rest stays. */
export const SavedJunk: Story = {
  beforeEach: () => savedPlanner(savedTrip(2, { months: ['2020-01'], destinations: ['atlantis', 'skardu'] }))(),
  play: async ({ canvas }) => {
    // Without a month, step 1 doesn't pass, so the planner opens there.
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when'));
    await expect(canvas.getAllByRole('button', { pressed: true }).map((b) => b.getAttribute('aria-label') ?? b.textContent)).toEqual(['Skardu', 'Flexible', '5–7 days']);
  },
};

/** /plan?dest=hunza ticks Hunza; the link loses dest with replaceState (no pushState, no new history entry), and the choice is saved. */
export const LinkedDestination: Story = {
  beforeEach: all(atQuery('?dest=hunza'), noNewHistory),
  play: async ({ canvas }) => {
    await waitFor(() => expect(button(canvas, 'Hunza')).toHaveAttribute('aria-pressed', 'true'));
    await waitFor(() => expect(window.location.search).toBe(''));
    await expect(pushed).toBe(0);
    await expect(saved()).toMatchObject({ destinations: ['hunza'] });
  },
};

export const LinkedDestinationPhone: Story = { ...LinkedDestination, globals: { viewport: { value: 'phone' } } };

/** A link joins the saved destinations, keeping the saved step. */
export const LinkedJoinsSaved: Story = {
  beforeEach: all(() => savedPlanner(savedTrip(2, { destinations: ['skardu'] }))(), atQuery('?dest=hunza')),
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming'));
    await userEvent.click(button(canvas, 'Back'));
    await expect(canvas.getAllByRole('button', { pressed: true }).slice(0, 2).map((b) => b.getAttribute('aria-label'))).toEqual(['Hunza', 'Skardu']);
  },
};

/** ?dest=nowhere changes nothing. */
export const LinkedUnknown: Story = {
  beforeEach: atQuery('?dest=nowhere'),
  play: async ({ canvas }) => {
    await waitFor(() => expect(window.location.search).toBe(''));
    await expect(canvas.getAllByRole('button', { pressed: true }).map((b) => b.textContent)).toEqual(['Flexible']);
    await expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull();
  },
};

/** "Plan another trip" removes the saved answers. */
export const AgainForgets: Story = {
  beforeEach: stayOnPage,
  play: async ({ canvas, userEvent }) => {
    await toReview(canvas, userEvent);
    await expect(saved()).toMatchObject({ step: 4 });
    await userEvent.click(canvas.getByRole('link', { name: 'Send on WhatsApp' }));
    await userEvent.click(button(canvas, 'Plan another trip'));
    await waitFor(() => expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull());
  },
};

/** With storage throwing (private mode, a full quota), the planner still works through every step. */
export const StorageThrows: Story = {
  beforeEach: all(stayOnPage, () => {
    const { getItem, setItem, removeItem } = Storage.prototype;
    const blocked = () => {
      throw new Error('blocked');
    };
    Object.assign(Storage.prototype, { getItem: blocked, setItem: blocked, removeItem: blocked });
    return () => Object.assign(Storage.prototype, { getItem, setItem, removeItem });
  }),
  play: async ({ canvas, userEvent }) => {
    await toReview(canvas, userEvent);
    await expect(progress(canvas)).toHaveTextContent('Review · Check and send');
    await userEvent.click(canvas.getByRole('link', { name: 'Send on WhatsApp' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 2, name: 'Thanks, Ayesha.' })).toHaveFocus());
    await userEvent.click(button(canvas, 'Plan another trip'));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when'));
  },
};

/* The wide and compact layouts (#77). */

/**
 * 1440: the "Your trip so far" postcard beside the form: the page's photo and "Your trip" until a
 * place is chosen, then its photo and name; nine rows, the count following the answers, empty rows
 * reading "Not yet"; gone on success.
 */
export const Aside: Story = {
  beforeEach: stayOnPage,
  play: async ({ canvas, userEvent }) => {
    const aside = canvas.getByRole('complementary', { name: 'Your trip so far' });
    const rows = within(aside);
    await expect(rows.getAllByRole('term')).toHaveLength(9);
    await expect(aside).toHaveTextContent('2 of 9');
    await expect(rows.getAllByRole('definition')[0]).toHaveTextContent('Not yet');
    await expect(rows.getByRole('img', { name: samplePlannerCopy.aside.image.alt })).toBeVisible();
    await expect(rows.getByText('Your trip', { selector: 'p' })).toBeVisible();
    await userEvent.click(button(canvas, 'Hunza'));
    await userEvent.click(monthChips(canvas)[3]);
    // A month alone leaves the trip length to the visitor.
    await expect(aside).toHaveTextContent('4 of 9');
    await expect(rows.getAllByRole('definition')[0]).toHaveTextContent('Hunza');
    await expect(rows.getByRole('img', { name: 'A view of Hunza' })).toBeVisible();
    await expect(rows.getByText('Hunza', { selector: 'p' })).toBeVisible();
    await expect(rows.getByRole('heading', { level: 2, name: 'What happens next' })).toBeVisible();
    await expect(rows.getAllByRole('listitem')).toHaveLength(3);
    await userEvent.click(button(canvas, /^Next/));
    await userEvent.click(button(canvas, /^Next/));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ayesha Khan');
    await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123 4567');
    await userEvent.click(button(canvas, /^Review/));
    await userEvent.click(canvas.getByRole('link', { name: 'Send on WhatsApp' }));
    await waitFor(() => expect(canvas.queryByRole('complementary', { name: 'Your trip so far' })).toBeNull());
  },
};

export const AsideLaptop: Story = { ...Aside, globals: { viewport: { value: 'laptop' } } };

/** 390: the summary bar reads the trip in one line, and Enter opens and closes it; only one progress heading exists. */
export const SummaryBar: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.queryByRole('complementary')).toBeNull();
    await userEvent.click(button(canvas, 'Hunza'));
    const month = monthChips(canvas)[3];
    await userEvent.click(month);
    await userEvent.click(button(canvas, /^Next/));
    await userEvent.click(button(canvas, 'More children'));
    await userEvent.click(button(canvas, 'More children'));
    const summary = canvasElement.querySelector('summary')!;
    await expect(summary).toHaveTextContent(`Hunza · ${month.textContent!.split(' ')[0]} · 4 people`);
    await expect(progress(canvas)).toHaveTextContent('Step 2 of 3 · Who’s coming');
    const user = await realUser();
    if (!user) return;
    summary.focus();
    await user.keyboard('{Enter}');
    await expect(summary.closest('details')!.open).toBe(true);
    await expect(within(summary.closest('details')!).getAllByRole('term')).toHaveLength(9);
    await user.keyboard('{Enter}');
    await expect(summary.closest('details')!.open).toBe(false);
  },
};

/**
 * 390: Back and Next live in the dark bottom bar; Next checks the step, Back appears from step 2,
 * and on review it becomes "Send on WhatsApp" with the trip request; "Request a call back" stays
 * inline, and the inline step buttons aren't shown.
 */
export const BottomBar: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getAllByRole('button', { name: /^Next/ })).toHaveLength(1);
    await expect(button(canvas, /^Next/)).toHaveAccessibleName('Next');
    await expect(button(canvas, /^Next/).closest('[data-surface]')).toHaveAttribute('data-surface', 'dark');
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
    await userEvent.click(button(canvas, /^Next/));
    await expect(canvas.getByText(/Choose at least one destination/)).toBeVisible();
    await toReview(canvas, userEvent);
    await expect(canvas.getAllByRole('button', { name: 'Back' })).toHaveLength(1);
    const sends = canvas.getAllByRole('link', { name: 'Send on WhatsApp' });
    await expect(sends).toHaveLength(1);
    await expect(sends[0].closest('[data-surface]')).toHaveAttribute('data-surface', 'dark');
    await expect(linkText(sends[0])).toContain('Assalam o Alaikum');
    await expect(canvas.getByRole('link', { name: 'Request a call back' }).closest('[data-surface="light"]')).toBeNull();
  },
};

/** 900 (below 1100px, from 820px): the bottom bar's Next names the step it goes to. */
export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button', { name: /^Next/ })).toHaveLength(1);
    await expect(button(canvas, /^Next/)).toHaveAccessibleName('Next: Who’s coming');
    await expect(canvas.queryByRole('complementary')).toBeNull();
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

/** 390, the summary bar open: a failed Next still lands the first card below the bar. */
export const EmptyNextBarOpen: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvasElement.querySelector('summary')!);
    await expect(canvasElement.querySelector('details')!.open).toBe(true);
    await userEvent.click(button(canvas, /^Next/));
    const first = button(canvas, 'Fairy Meadows');
    await waitFor(() => expect(first).toHaveFocus());
    await expect(first.getBoundingClientRect().top).toBeGreaterThanOrEqual(bar(canvas).getBoundingClientRect().bottom);
  },
};
