import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { Hotels } from './Hotels';

const five = [1, 2, 3, 4, 5].map((n) => ({ ...sampleTour.stays[1], nights: { from: n, to: n } }));

const meta = {
  title: 'Sections/Hotels',
  component: Hotels,
  args: { copy: sampleTourCopy.hotels, stays: sampleTour.stays },
  parameters: { fullBleed: true },
} satisfies Meta<typeof Hotels>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three stays: three columns, never more columns than stays, then the note. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Where you’ll stay each night' })).toBeVisible();
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(3);
    await expect(canvas.getByText(/All rooms are twin sharing/)).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Five stays across at 1440. */
export const FiveStays: Story = {
  args: { stays: five },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(5);
  },
};

/** One stay isn't stretched across the page. */
export const OneStay: Story = {
  args: { stays: [sampleTour.stays[1]] },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem').getBoundingClientRect().width).toBeLessThanOrEqual(320);
  },
};

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(2);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
