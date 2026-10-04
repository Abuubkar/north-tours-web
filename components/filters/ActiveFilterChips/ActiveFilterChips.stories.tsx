import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { atQuery } from '../../../.storybook/storyUrl';
import { sampleOptionLabels, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { ActiveFilterChips } from './ActiveFilterChips';

const meta = {
  title: 'Filters/ActiveFilterChips',
  component: ActiveFilterChips,
  args: { labels: sampleOptionLabels, clearLabel: sampleToursCopy.filters.clearAll },
  decorators: [withTourFilters()],
  beforeEach: atQuery('?dest=hunza&type=family&month=2099-06&sort=price-asc'),
} satisfies Meta<typeof ActiveFilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One chip per picked option, in group then option order, then "Clear all". */
export const Chips: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button').map((b) => b.getAttribute('aria-label') ?? b.textContent)).toEqual([
      'Remove filter Hunza',
      'Remove filter Family',
      'Remove filter June 2099',
      'Clear all',
    ]);
  },
};

export const ChipsOnLight: Story = { ...Chips, globals: { surface: 'light' } };

export const ChipsPhone: Story = { ...Chips, globals: { viewport: { value: 'phone' } } };

/** A chip removes its own filter; "Clear all" removes the rest and keeps the sort. */
export const Removing: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove filter Family' }));
    await expect(window.location.search).toBe('?dest=hunza&month=2099-06&sort=price-asc');
    await expect(canvas.getByRole('button', { name: 'Remove filter June 2099' })).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear all' }));
    await expect(window.location.search).toBe('?sort=price-asc');
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

/** With nothing picked, nothing shows. */
export const None: Story = {
  beforeEach: atQuery(''),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('button')).toBeNull();
  },
};
