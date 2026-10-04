import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { PlannerProgress } from '../PlannerProgress/PlannerProgress';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { PlannerSummaryBar } from './PlannerSummaryBar';

const meta = {
  title: 'Planner/PlannerSummaryBar',
  component: PlannerSummaryBar,
  args: {
    label: 'Hunza · Jun · 4 people',
    copy: samplePlannerCopy.aside,
    children: <PlannerProgress text="Step 2 of 3 · Who’s coming" total={3} filled={2} />,
  },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
  parameters: { fullBleed: true },
  globals: { surface: 'light', viewport: { value: 'phone' } },
} satisfies Meta<typeof PlannerSummaryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A 52px row with the trip, a caret, the progress under it; real keys open and close it to show
 * the nine rows. Light only: its frosted bar is the light page's (the planner is always light).
 */
export const Phone: Story = {
  play: async ({ canvas, canvasElement }) => {
    const summary = canvasElement.querySelector('summary')!;
    await expect(summary).toHaveTextContent('Hunza · Jun · 4 people');
    await expect(summary.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Step 2 of 3 · Who’s coming' })).toBeVisible();
    const user = await realUser();
    if (!user) return;
    summary.focus();
    await user.keyboard('{Enter}');
    await expect(canvas.getAllByRole('term')).toHaveLength(9);
    await user.keyboard('{Enter}');
    await expect(summary.closest('details')!.open).toBe(false);
  },
};

/** From 1100px it isn't shown (the side column and the progress in the form take over). */
export const Desktop: Story = {
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('summary')!.getClientRects()).toHaveLength(0);
  },
};
