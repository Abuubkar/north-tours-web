import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { DayMiniMap } from '../DayMiniMap/DayMiniMap';
import { sampleDays, sampleMiniDrawing } from '../sampleItinerary';
import { ItineraryDay } from './ItineraryDay';

const meta = {
  title: 'Itinerary/ItineraryDay',
  component: ItineraryDay,
  args: {
    day: sampleDays[2],
    number: 3,
    state: 'current',
    copy: sampleTourCopy.itinerary,
    miniMap: <DayMiniMap drawing={sampleMiniDrawing} day={2} stops={sampleDays[2].stops} />,
  },
  render: (args) => (
    <ol>
      <ItineraryDay {...args} />
    </ol>
  ),
} satisfies Meta<typeof ItineraryDay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Day 03", the title as a heading, the text, then Overnight, Meals and Drive. */
export const Current: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem')).toHaveAttribute('aria-current', 'step');
    await expect(canvas.getByText('Day 03')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Chilas → Hunza' })).toBeVisible();
    await expect(canvas.getAllByRole('term').map((t) => t.textContent)).toEqual(['Overnight', 'Meals', 'Drive']);
    await expect(canvas.getAllByRole('definition').map((d) => d.textContent)).toEqual(['Karimabad, Hunza', 'Breakfast, dinner', '6–7 hrs']);
  },
};

export const CurrentOnLight: Story = { ...Current, globals: { surface: 'light' } };

/** Below 1280px the mini map shows beside the title. */
export const Phone: Story = {
  ...Current,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Current.play!(context);
    await expect(context.canvasElement.querySelector('[aria-hidden="true"] svg')).toBeVisible();
  },
};

/** From 1280px it's hidden: the side map takes over. */
export const Desktop: Story = {
  ...Current,
  globals: { viewport: { value: 'desktop' } },
  play: async (context) => {
    await Current.play!(context);
    await expect(context.canvasElement.querySelector('[aria-hidden="true"] svg')).not.toBeVisible();
  },
};

export const Upcoming: Story = {
  args: { state: 'upcoming' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem')).not.toHaveAttribute('aria-current');
  },
};

export const UpcomingOnLight: Story = { ...Upcoming, globals: { surface: 'light' } };
