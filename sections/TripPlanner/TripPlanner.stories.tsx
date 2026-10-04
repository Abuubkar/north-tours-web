import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { opacityUpTo } from '../../.storybook/opacity';
import { realUser } from '../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import { samplePlannerCopy, samplePlannerDestinations, withPlanner } from '@/components/planner/samplePlanner';
import { todayInKarachi } from '@/lib/utils/departures';
import { TripPlanner } from './TripPlanner';

const meta = {
  title: 'Sections/TripPlanner',
  component: TripPlanner,
  args: { copy: samplePlannerCopy, destinations: samplePlannerDestinations },
  decorators: [withPlanner],
  beforeEach: async () => {
    await emulateReducedMotion();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TripPlanner>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

const button = (canvas: Canvas, name: string | RegExp) => canvas.getByRole('button', { name });
const progress = (canvas: Canvas) => canvas.getByRole('heading', { level: 2 });
const monthChips = (canvas: Canvas) => within(canvas.getByRole('group', { name: 'Month' })).getAllByRole('button');
/** The sticky bar holding the progress. */
const bar = (canvas: Canvas) => progress(canvas).parentElement!.parentElement!;

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

/** Step 1: one <h1> at the statement size, the progress, the questions and Next; nothing scrolls sideways. */
export const Step1: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' })).toBeVisible();
    await expect(progress(canvas)).toHaveTextContent('Step 1 of 3 · Where and when');
    await expect(canvas.getByRole('group', { name: 'Destinations' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { pressed: false }).length).toBeGreaterThan(7);
    await expect(button(canvas, 'Not sure, suggest something')).toBeVisible();
    await expect(monthChips(canvas)).toHaveLength(12);
    await expect(button(canvas, /^Next: Who’s coming/)).toBeVisible();
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
 * before From; Flexible brings the months back. A month replaces another, and picking it again
 * clears it.
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
    await expect(first).toHaveAttribute('aria-pressed', 'false');
    await expect(second).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(second);
    await expect(monthChips(canvas).every((chip) => chip.getAttribute('aria-pressed') === 'false')).toBe(true);
  },
};

/** With a month chosen, the days stepper fills the trip length until the visitor picks one. */
export const LengthFollowsDays: Story = {
  play: async ({ canvas, userEvent }) => {
    const length = canvas.getByRole('group', { name: 'Trip length' });
    await userEvent.click(monthChips(canvas)[3]);
    await expect(button(canvas, '5–7 days')).toHaveAttribute('aria-pressed', 'true');
    await expect(length).toHaveAccessibleDescription('Optional · filled from your flexible dates');
    await userEvent.click(button(canvas, 'More days'));
    await userEvent.click(button(canvas, 'More days'));
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'true');
    // Pressing the filled-in length keeps it, and it stops following the days.
    await userEvent.click(button(canvas, '8–10 days'));
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'true');
    await expect(length).toHaveAccessibleDescription('Optional');
    await userEvent.click(button(canvas, 'Fewer days'));
    await expect(button(canvas, '8–10 days')).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button(canvas, '2–4 days'));
    await expect(length).toHaveAccessibleDescription('Optional');
    await userEvent.click(button(canvas, 'More days'));
    await expect(button(canvas, '2–4 days')).toHaveAttribute('aria-pressed', 'true');
  },
};

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
    const body = progress(canvas).parentElement!.parentElement!.nextElementSibling as HTMLElement;
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
  play: async ({ canvas, userEvent }) => {
    await toStep2(canvas, userEvent);
    const body = progress(canvas).parentElement!.parentElement!.nextElementSibling as HTMLElement;
    await expect(body.getAnimations()).toHaveLength(0);
  },
};
