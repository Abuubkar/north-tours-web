import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { ResultsHeader } from './ResultsHeader';

const meta = {
  title: 'Filters/ResultsHeader',
  component: ResultsHeader,
  args: { count: '8 trips', sortedBy: 'Sorted by soonest departure · sold-out trips last' },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof ResultsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 820px: the count as the results' <h2>, and how they're sorted. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: '8 trips' })).toBeVisible();
    await expect(canvas.getByText('Sorted by soonest departure · sold-out trips last')).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** Below 820px the heading is still there for screen readers, but the bar shows the count instead. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: '8 trips' });
    await expect(heading.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvas.getByText('Sorted by soonest departure · sold-out trips last')).not.toBeVisible();
  },
};
