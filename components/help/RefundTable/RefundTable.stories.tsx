import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { samplePolicies, sampleHelpCopy } from '@/sections/sampleHelp';
import { RefundTable } from './RefundTable';

const { refundTable } = sampleHelpCopy.policies;

const meta = {
  title: 'Help/RefundTable',
  component: RefundTable,
  args: { caption: refundTable.caption, daysHeader: refundTable.days, refundHeader: refundTable.refund, rows: samplePolicies[0].refundRows! },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof RefundTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A table named by its hidden caption, two column headers, and the settings schedule's three rows. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: refundTable.caption });
    await expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Days before departure', 'Refund of advance']);
    const rows = within(table).getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell').map((cell) => cell.textContent));
    await expect(rows).toEqual([
      ['14 or more days', '100%'],
      ['7–13 days', '50%'],
      ['Under 7 days', 'None'],
    ]);
    await expect(getComputedStyle(within(table).getAllByRole('cell')[1]).textAlign).toBe('right');
  },
};

export const DefaultOnDark: Story = { ...Default, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'phone' } } };
