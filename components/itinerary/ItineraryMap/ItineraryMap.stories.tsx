import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { sampleDays, sampleSideDrawing } from '../sampleItinerary';
import { ItineraryMap } from './ItineraryMap';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Itinerary/ItineraryMap',
  component: ItineraryMap,
  args: { drawing: sampleSideDrawing, days: sampleDays, active: 2, copy: sampleTourCopy.itinerary.map },
  decorators: [
    (Story) => (
      <div className={styles.sideMap}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ItineraryMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One image with a short description, its header on the day being read. */
export const OnADay: Story = {
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img', { name: 'Schematic map of this tour’s route' });
    await expect(map).toHaveTextContent(/^Day 03 of 09Chilas → Hunza/);
    await expect(within(map).getByText('Schematic · roads simplified')).toBeInTheDocument();
    const progress = map.querySelectorAll('path')[1];
    await expect(parseFloat(getComputedStyle(progress).strokeDashoffset)).toBeCloseTo(1 - sampleSideDrawing.progress[2]);
  },
};

export const OnADayOnLight: Story = { ...OnADay, globals: { surface: 'light' } };

export const OnADayDesktop: Story = { ...OnADay, globals: { viewport: { value: 'desktop' } } };

/** Before day 1: "Start" over the start, and no progress yet. */
export const BeforeDay1: Story = {
  args: { active: -1 },
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img');
    await expect(map).toHaveTextContent(/^StartLahore/);
    await expect(parseFloat(getComputedStyle(map.querySelectorAll('path')[1]).strokeDashoffset)).toBe(1);
  },
};

/** The last day: the line reaches home. */
export const LastDay: Story = {
  args: { active: 8 },
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img');
    await expect(map).toHaveTextContent(/^Day 09 of 09/);
    await expect(parseFloat(getComputedStyle(map.querySelectorAll('path')[1]).strokeDashoffset)).toBe(0);
  },
};

export const LastDayOnLight: Story = { ...LastDay, globals: { surface: 'light' } };
