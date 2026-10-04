import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { TripSummaryRows } from './TripSummaryRows';

const meta = {
  title: 'Planner/TripSummaryRows',
  component: TripSummaryRows,
  args: { copy: samplePlannerCopy.aside },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
} satisfies Meta<typeof TripSummaryRows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nine rows; an empty one reads "Not yet", in the quietest text colour. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('term')).toHaveLength(9);
    await expect(await canvas.findByText('Hunza')).toBeVisible();
    const transport = canvas.getAllByRole('definition')[6];
    await expect(transport).toHaveTextContent('Not yet');
    await expect(canvas.queryByText('—')).toBeNull();
    const quiet = getComputedStyle(canvas.getAllByText('Not yet')[0]).color;
    await expect(quiet).not.toBe(getComputedStyle(canvas.getByText('Hunza')).color);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
