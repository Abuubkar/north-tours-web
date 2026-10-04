import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { StepNav } from './StepNav';

const meta = {
  title: 'Planner/StepNav',
  component: StepNav,
  args: { nextLabel: 'Next: Who’s coming', onBack: fn(), onNext: fn() },
  globals: { surface: 'light' },
} satisfies Meta<typeof StepNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Step 1: Next alone (primary, 52px), at the right. */
export const Step1: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
    const next = canvas.getByRole('button', { name: 'Next: Who’s coming' });
    await expect(next.getBoundingClientRect().height).toBe(52);
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledOnce();
  },
};

/** From step 2: Back (quiet) too. */
export const WithBack: Story = {
  args: { backLabel: 'Back', nextLabel: 'Next: Your details' },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};

export const WithBackOnDark: Story = { ...WithBack, globals: { surface: 'dark' } };

export const WithBackPhone: Story = { ...WithBack, globals: { surface: 'light', viewport: { value: 'phone' } } };
