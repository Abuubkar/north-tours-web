import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, samplePlannerDestinations, withPlanner } from '../samplePlanner';
import { StepWhereWhen } from './StepWhereWhen';

const meta = {
  title: 'Planner/StepWhereWhen',
  component: StepWhereWhen,
  args: { destinations: samplePlannerDestinations, copy: samplePlannerCopy.whereWhen },
  decorators: [withPlanner],
  beforeEach: noSavedPlanner,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof StepWhereWhen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The three questions, each a named group; nothing scrolls sideways. (Behaviour: Sections/TripPlanner.) */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    for (const name of ['Destinations', 'Dates', 'Trip length']) {
      await expect(canvas.getByRole('group', { name })).toBeVisible();
    }
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };
