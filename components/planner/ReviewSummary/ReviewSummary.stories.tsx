import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, withAnsweredPlanner } from '../samplePlanner';
import { ReviewSummary } from './ReviewSummary';

const meta = {
  title: 'Planner/ReviewSummary',
  component: ReviewSummary,
  args: { copy: samplePlannerCopy.review, steps: samplePlannerCopy.steps },
  decorators: [withAnsweredPlanner],
  beforeEach: noSavedPlanner,
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof ReviewSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three sections, each an <h3> with "Edit {section}"; values in rows, "Not given" for the rest; an 8px panel. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Where and when', 'Who’s coming', 'Your details']);
    for (const name of ['Edit where and when', 'Edit who’s coming', 'Edit your details']) {
      await expect(canvas.getByRole('button', { name })).toHaveTextContent('Edit');
    }
    await expect(await canvas.findByText('2 adults, 2 children (ages 6, 9)')).toBeVisible();
    await expect(canvas.getByText('+92 300 123 4567')).toBeVisible();
    await expect(canvas.getAllByText('Not given')).toHaveLength(3);
    await expect(getComputedStyle(canvasElement.querySelector('section')!.parentElement!).borderRadius).toBe('8px');
  },
};

export const OnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** At 390 the label column stays beside each value, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const value = await canvas.findByText('Ayesha Khan');
    const label = canvas.getByText('Name');
    await expect(value.getBoundingClientRect().top).toBe(label.getBoundingClientRect().top);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
