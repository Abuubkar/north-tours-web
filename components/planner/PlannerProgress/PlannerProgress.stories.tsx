import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { PlannerProgress } from './PlannerProgress';

const meta = {
  title: 'Planner/PlannerProgress',
  component: PlannerProgress,
  args: { text: 'Step 1 of 3 · Where and when', filled: 1 },
  globals: { surface: 'light' },
} satisfies Meta<typeof PlannerProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const lit = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('[aria-hidden="true"] > span')].map((s) => getComputedStyle(s).backgroundColor);

/** An <h2> announced politely, over three 2px segments; the first lit. */
export const Step1: Story = {
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'Step 1 of 3 · Where and when' });
    await expect(heading).toHaveAttribute('aria-live', 'polite');
    await expect(heading).toHaveAttribute('tabindex', '-1');
    const colours = lit(canvasElement);
    await expect(colours).toHaveLength(3);
    await expect(colours[0]).toBe(getComputedStyle(heading).color);
    await expect(colours[1]).not.toBe(colours[0]);
  },
};

export const Step1OnDark: Story = { ...Step1, globals: { surface: 'dark' } };

/** Step 2: two segments lit. */
export const Step2: Story = {
  args: { text: 'Step 2 of 3 · Who’s coming', filled: 2 },
  play: async ({ canvasElement }) => {
    const colours = lit(canvasElement);
    await expect(colours[1]).toBe(colours[0]);
    await expect(colours[2]).not.toBe(colours[0]);
  },
};
