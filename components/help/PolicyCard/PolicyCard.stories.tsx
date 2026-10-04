import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { samplePolicies, sampleHelpCopy } from '@/sections/sampleHelp';
import { PolicyCard } from './PolicyCard';

const { policies } = sampleHelpCopy;

const meta = {
  title: 'Help/PolicyCard',
  component: PolicyCard,
  args: { ...samplePolicies[0], table: policies.refundTable, readMore: policies.readMore, hide: policies.hide },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof PolicyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The title as an <h3>, the summary, the refund table, then "Read the full policy": Enter opens
 * the full text and the summary reads "Hide the full policy"; Enter again closes it (real keys).
 */
export const Cancellation: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Cancellation & refunds' })).toBeVisible();
    await expect(canvas.getByRole('table')).toBeVisible();
    const summary = canvasElement.querySelector('summary')!;
    const details = summary.closest('details')!;
    await expect(summary.innerText.trim()).toBe('Read the full policy');
    await expect(summary.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(details.open).toBe(false);
    const keys = await realUser();
    if (!keys) return;
    summary.focus();
    await keys.keyboard('{Enter}');
    await expect(details.open).toBe(true);
    await expect(summary.innerText.trim()).toBe('Hide the full policy');
    await expect(canvas.getByText(samplePolicies[0].paragraphs[0])).toBeVisible();
    await keys.keyboard('{Enter}');
    await expect(details.open).toBe(false);
    await expect(summary.innerText.trim()).toBe('Read the full policy');
  },
};

export const CancellationOnDark: Story = { ...Cancellation, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const CancellationPhone: Story = { ...Cancellation, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** A policy without the table, its full text open (axe checks it on both surfaces). */
export const PaymentsOpen: Story = {
  args: { ...samplePolicies[2], refundRows: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('table')).toBeNull();
    canvasElement.querySelector('details')!.open = true;
    await expect(canvas.getByText(samplePolicies[2].paragraphs[0])).toBeVisible();
  },
};

export const PaymentsOpenOnDark: Story = { ...PaymentsOpen, globals: { surface: 'dark', viewport: { value: 'desktop' } } };
