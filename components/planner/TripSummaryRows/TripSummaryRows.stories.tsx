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
  globals: { surface: 'light' },
} satisfies Meta<typeof TripSummaryRows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nine rows; an empty one shows "—" and is read as "Not answered". */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('term')).toHaveLength(9);
    await expect(await canvas.findByText('Hunza')).toBeVisible();
    const transport = canvas.getAllByRole('definition')[6];
    await expect(transport).toHaveTextContent('Not answered');
    await expect(canvas.getAllByText('—')[0]).toHaveAttribute('aria-hidden', 'true');
  },
};

export const OnDark: Story = { ...Default, globals: { surface: 'dark' } };
