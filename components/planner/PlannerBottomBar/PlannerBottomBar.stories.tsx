import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { PlannerBottomBar } from './PlannerBottomBar';

const meta = {
  title: 'Planner/PlannerBottomBar',
  component: PlannerBottomBar,
  args: { nextShort: 'Next', nextLabel: 'Next: Who’s coming', onBack: fn(), onNext: fn(), onSend: fn() },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof PlannerBottomBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 390, step 1: a dark bar with a 48px "Next" across the row. */
export const Phone: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(next.closest('[data-surface]')).toHaveAttribute('data-surface', 'dark');
    await expect(next.getBoundingClientRect().height).toBe(48);
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledOnce();
  },
};

/** From 820px Next names the step it goes to; Back (quiet) from step 2. */
export const Tablet: Story = {
  args: { backLabel: 'Back' },
  globals: { viewport: { value: 'tablet' } },
  play: async ({ canvas, args, userEvent }) => {
    await expect(canvas.getByRole('button', { name: 'Next: Who’s coming' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};

/** On review: "Send on WhatsApp", a wa.me link in a new tab. */
export const Review: Story = {
  args: { backLabel: 'Back', send: { label: 'Send on WhatsApp', href: 'https://wa.me/?text=Hi' } },
  play: async ({ canvas }) => {
    const send = canvas.getByRole('link', { name: 'Send on WhatsApp' });
    await expect(send).toHaveAttribute('href', 'https://wa.me/?text=Hi');
    await expect(send).toHaveAttribute('target', '_blank');
    await expect(canvas.queryByRole('button', { name: /^Next/ })).toBeNull();
  },
};

/** From 1100px it isn't shown (the form has its own Back and Next). */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: /^Next/ })).toBeNull();
  },
};
