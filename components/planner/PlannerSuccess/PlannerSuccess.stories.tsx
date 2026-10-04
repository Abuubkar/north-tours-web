import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { PlannerSuccess } from './PlannerSuccess';

const meta = {
  title: 'Planner/PlannerSuccess',
  component: PlannerSuccess,
  args: { copy: samplePlannerCopy.success },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof PlannerSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Thanks, Ayesha." (an <h2>, focusable by script), the line, Browse tours, Explore destinations and Plan another trip. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const thanks = await canvas.findByRole('heading', { level: 2, name: 'Thanks, Ayesha.' });
    await expect(thanks).toHaveAttribute('tabindex', '-1');
    await expect(canvas.getByText(/Check WhatsApp, we’ll reply within 2 hours/)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Browse tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByRole('link', { name: 'Explore destinations' })).toHaveAttribute('href', '/destinations');
    await expect(canvas.getByRole('button', { name: 'Plan another trip' })).toBeVisible();
  },
};

export const OnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const Laptop: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'laptop' } } };
