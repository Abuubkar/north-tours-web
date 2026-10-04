import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { roomBelow } from '../../../.storybook/scrollRoom';
import { DayMiniMap } from '../DayMiniMap/DayMiniMap';
import { sampleDays, sampleMiniDrawing, sampleSideDrawing } from '../sampleItinerary';
import { ItineraryTimeline } from './ItineraryTimeline';

const meta = {
  title: 'Itinerary/ItineraryTimeline',
  component: ItineraryTimeline,
  args: {
    days: sampleDays,
    copy: sampleTourCopy.itinerary,
    drawing: sampleSideDrawing,
    miniMaps: sampleDays.map((day, i) => <DayMiniMap key={i} drawing={sampleMiniDrawing} day={i} stops={day.stops} />),
  },
  decorators: [roomBelow],
  beforeEach: emulateFullMotion,
} satisfies Meta<typeof ItineraryTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Puts a day's top just above half the screen, as a reader scrolling down would. */
const readDay = (n: number) => {
  const day = document.getElementById(`day-${n}`)!;
  window.scrollBy(0, day.getBoundingClientRect().top - window.innerHeight * 0.45);
};

/** The days are an ordered list, "Day 01" to "Day 09", each title a heading with its facts. */
export const Days: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const list = canvas.getAllByRole('list')[0];
    await expect(list.tagName).toBe('OL');
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(sampleDays.map((d) => d.title));
    await expect(canvas.getByText('Day 01')).toBeVisible();
    await expect(canvas.getByText('Day 09')).toBeInTheDocument();
    await expect(canvas.getAllByRole('term')).toHaveLength(sampleDays.length * 3);
  },
};

export const DaysOnLight: Story = { ...Days, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Scrolled to day 3: its node is current (aria-current="step") and the side map reads "Day 03 of 09". */
export const ReadingADay: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img', { name: 'Schematic map of this tour’s route' });
    await expect(map).toHaveTextContent(/^StartLahore/);
    readDay(3);
    await waitFor(() => expect(document.getElementById('day-3')).toHaveAttribute('aria-current', 'step'));
    await expect(map).toHaveTextContent(/^Day 03 of 09/);
    await expect(document.getElementById('day-2')).not.toHaveAttribute('aria-current');
    // The progress line moves to the day with a short transition.
    await expect(getComputedStyle(map.querySelectorAll('path')[1]).transitionDuration).not.toBe('0s');
  },
};

export const ReadingADayOnLight: Story = { ...ReadingADay, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 1366 (from 1280px) the side map sits beside the days, and the mini maps are hidden. */
export const Laptop: Story = {
  globals: { viewport: { value: 'laptop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('img', { name: 'Schematic map of this tour’s route' })).toBeVisible();
    await expect(canvasElement.querySelector('li > div [aria-hidden="true"]')).not.toBeVisible();
  },
};

/** Below 1280px there's no side map; each day has its mini map, hidden from screen readers. */
export const Tablet: Story = {
  globals: { viewport: { value: 'breakpoint820' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('img')).toBeNull();
    const minis = canvasElement.querySelectorAll('li > div [aria-hidden="true"]');
    await expect(minis).toHaveLength(sampleDays.length);
    await expect(minis[0]).toBeVisible();
  },
};

export const Phone: Story = {
  ...Tablet,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Tablet.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** With reduced motion the progress line jumps: no transition. */
export const ReducedMotion: Story = {
  beforeEach: emulateReducedMotion,
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img');
    await expect(getComputedStyle(map.querySelectorAll('path')[1]).transitionDuration).toBe('0s');
  },
};

export const LaptopOnLight: Story = { ...Laptop, globals: { surface: 'light', viewport: { value: 'laptop' } } };

export const TabletOnLight: Story = { ...Tablet, globals: { surface: 'light', viewport: { value: 'breakpoint820' } } };

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const ReducedMotionOnLight: Story = { ...ReducedMotion, globals: { surface: 'light', viewport: { value: 'desktop' } } };
