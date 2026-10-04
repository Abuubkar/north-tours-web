import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { atQuery } from '../../../.storybook/storyUrl';
import { sampleToursCopy, withTourFilters } from '../sampleFilters';
import { SortMenu } from './SortMenu';

const meta = {
  title: 'Filters/SortMenu',
  component: SortMenu,
  args: { label: sampleToursCopy.sortLabel, sorts: sampleToursCopy.sorts },
  decorators: [withTourFilters()],
  beforeEach: atQuery(''),
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SortMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Sort: Soonest departure" opens the four sorts as radios; picking one closes it and writes the sort. */
export const PickASort: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Sort: Soonest departure' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('button', { name: 'Soonest departure' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Shortest first' }));
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveAccessibleName('Sort: Shortest first');
    await expect(window.location.search).toBe('?sort=shortest');
  },
};

/** Open, for axe on both surfaces. */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Sort:/ }));
    await expect(canvas.getByRole('button', { name: 'Price: high to low' })).toBeVisible();
  },
};

export const OpenOnLight: Story = { ...Open, globals: { surface: 'light', viewport: { value: 'desktop' } } };
