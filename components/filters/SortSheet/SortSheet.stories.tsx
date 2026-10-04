import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { atQuery } from '../../../.storybook/storyUrl';
import { sampleToursCopy, withTourFilters } from '../sampleFilters';
import { SortSheet } from './SortSheet';

const onClose = fn();

const meta = {
  title: 'Filters/SortSheet',
  component: SortSheet,
  args: { open: true, onClose, title: 'Sort by', sorts: sampleToursCopy.sorts },
  decorators: [withTourFilters()],
  beforeEach: atQuery('?sort=price-asc'),
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof SortSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Sort by": four 56px rows, the current one pressed; picking one sorts and closes. */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    const rows = ['Soonest departure', 'Price: low to high', 'Price: high to low', 'Shortest first'].map((name) =>
      canvas.getByRole('button', { name }),
    );
    for (const row of rows) await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(56);
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(rows[3]);
    await expect(window.location.search).toBe('?sort=shortest');
    await expect(onClose).toHaveBeenCalled();
  },
};

export const OpenOnLight: Story = { ...Open, globals: { surface: 'light', viewport: { value: 'phone' } } };
