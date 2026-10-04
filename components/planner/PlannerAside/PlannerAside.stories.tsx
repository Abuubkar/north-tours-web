import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { PlannerAside } from './PlannerAside';

const meta = {
  title: 'Planner/PlannerAside',
  component: PlannerAside,
  args: { copy: samplePlannerCopy.aside, next: samplePlannerCopy.next },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof PlannerAside>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 1100px: a named aside, 380px wide, sticky under the header, with the count, the rows and what happens next. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const aside = canvas.getByRole('complementary', { name: 'Your trip so far' });
    await expect(getComputedStyle(aside).flexBasis).toBe('380px');
    await expect(getComputedStyle(aside).position).toBe('sticky');
    await expect(await canvas.findByText('7 of 9 answered')).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Your trip so far', 'What happens next']);
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** Below 1100px it isn't shown (the summary bar takes over). */
export const Phone: Story = {
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('complementary')).toBeNull();
  },
};
