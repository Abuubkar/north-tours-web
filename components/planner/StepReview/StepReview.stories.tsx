import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { StepReview } from './StepReview';

const meta = {
  title: 'Planner/StepReview',
  component: StepReview,
  args: { copy: samplePlannerCopy.review, steps: samplePlannerCopy.steps, backLabel: 'Back' },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof StepReview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Back (quiet), Send on WhatsApp (primary, a wa.me link in a new tab) and Request a call back (secondary), all 52px. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const send = canvas.getByRole('link', { name: 'Send on WhatsApp' });
    await expect(send.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
    await expect(send).toHaveAttribute('target', '_blank');
    await expect(canvas.getByRole('link', { name: 'Request a call back' })).toHaveAttribute('rel', 'noopener');
    for (const control of [canvas.getByRole('button', { name: 'Back' }), send]) {
      await expect(control.getBoundingClientRect().height).toBe(52);
    }
  },
};

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** Below 1100px only the call back stays inline; Back and Send are in the bottom bar. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Request a call back' })).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Send on WhatsApp' })).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
  },
};
