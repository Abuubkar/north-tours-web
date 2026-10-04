import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { sampleToursCopy } from '../sampleFilters';
import { EmptyResults } from './EmptyResults';

const onClear = fn();

const meta = {
  title: 'Filters/EmptyResults',
  component: EmptyResults,
  args: { copy: sampleToursCopy.empty, onClear },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof EmptyResults>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The fixed headline as an <h2>, the lead, "Clear all filters" and "Plan a private trip" (to the planner). */
export const Desktop: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
    await expect(canvas.getByText(/Tell us what you’re looking for/)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear all filters' }));
    await expect(onClear).toHaveBeenCalled();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the buttons wrap, each at least 52px tall, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    for (const button of [canvas.getByRole('button', { name: 'Clear all filters' }), canvas.getByRole('link', { name: 'Plan a private trip' })]) {
      await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    }
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
