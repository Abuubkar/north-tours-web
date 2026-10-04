import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { atQuery } from '../../../.storybook/storyUrl';
import { sampleOptionLabels, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { FilterGroup } from './FilterGroup';

const meta = {
  title: 'Filters/FilterGroup',
  component: FilterGroup,
  args: { group: 'dest', label: 'Destination', labels: sampleOptionLabels, countWords: sampleToursCopy.results.count },
  decorators: [withTourFilters()],
  beforeEach: atQuery(''),
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof FilterGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Destination open: every valley with its count, as checkboxes; it stays open while ticking. */
export const Destination: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Destination' }));
    await expect(canvas.getAllByRole('button', { name: /trips?$/ }).map((row) => row.getAttribute('aria-label'))).toEqual([
      'Fairy Meadows, 1 trip',
      'Hunza, 2 trips',
      'Murree, 1 trip',
      'Naran-Kaghan, 1 trip',
      'Skardu, 2 trips',
      'Swat, 2 trips',
    ]);
    await userEvent.click(canvas.getByRole('button', { name: 'Swat, 2 trips' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Hunza, 2 trips' }));
    await expect(canvas.getByRole('button', { name: /^Destination \(2\)/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(window.location.search).toBe('?dest=hunza,swat');
  },
};

export const DestinationOnLight: Story = { ...Destination, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Month: the months with a departure, one at a time. */
export const Month: Story = {
  args: { group: 'month', label: 'Month' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Month' }));
    await expect(canvas.getAllByRole('button', { name: /trips?$/ }).map((row) => row.textContent)).toEqual([
      'May 20993',
      'June 20994',
      'July 20995',
      'August 20993',
    ]);
  },
};

export const MonthOnLight: Story = { ...Month, globals: { surface: 'light', viewport: { value: 'desktop' } } };
