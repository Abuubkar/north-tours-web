import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { atQuery } from '../../../.storybook/storyUrl';
import { sampleOptionLabels, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { FilterSheet } from './FilterSheet';

const onClose = fn();

const meta = {
  title: 'Filters/FilterSheet',
  component: FilterSheet,
  args: { open: true, onClose, copy: sampleToursCopy, labels: sampleOptionLabels },
  decorators: [withTourFilters()],
  beforeEach: atQuery('?dest=hunza'),
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof FilterSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Five named groups of chips with counts, and the pinned footer: "Clear all" and "Show 2 trips". */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    const sheet = canvas.getByRole('dialog', { name: 'Filters' });
    for (const name of ['Destination', 'Duration', 'Budget', 'Trip type', 'Month']) {
      await expect(within(sheet).getByRole('group', { name })).toBeVisible();
    }
    await expect(within(sheet).getByRole('button', { name: 'Hunza, 2 trips' })).toHaveAttribute('aria-pressed', 'true');
    // The footer stays in view at the bottom of the screen (once the sheet has slid up) while the groups scroll.
    const show = within(sheet).getByRole('button', { name: 'Show 2 trips' });
    await waitFor(() => expect(Math.round(show.getBoundingClientRect().bottom)).toBeLessThanOrEqual(window.innerHeight));
    await userEvent.click(within(sheet).getByRole('button', { name: 'Clear all' }));
    await expect(within(sheet).getByRole('button', { name: 'Show 8 trips' })).toBeVisible();
    await userEvent.click(within(sheet).getByRole('button', { name: 'Show 8 trips' }));
    await expect(onClose).toHaveBeenCalled();
  },
};

export const OpenOnLight: Story = { ...Open, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** One trip: "Show 1 trip". */
export const OneTrip: Story = {
  beforeEach: atQuery('?dest=murree'),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Show 1 trip' })).toBeVisible();
  },
};

/** None: "No trips match", the secondary look, still enabled. */
export const NoneMatch: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'No trips match' });
    await expect(button).toBeEnabled();
    await expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

export const NoneMatchOnLight: Story = { ...NoneMatch, globals: { surface: 'light', viewport: { value: 'phone' } } };
