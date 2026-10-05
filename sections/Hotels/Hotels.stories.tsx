import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { drawsLines, gridColumns, gridGaps } from '../../.storybook/gridColumns';
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

const cardMax = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hotel-card-max'));

/**
 * Three stays: three photo cards 24px apart with no lines, never more columns than stays, each
 * at most 320px (the width cap allows for the gaps), then the note.
 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Where you’ll stay each night' })).toBeVisible();
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(3);
    await expect(gridGaps(items).column).toBe(24);
    for (const element of [canvas.getByRole('list'), ...items]) await expect(drawsLines(element)).toBe(false);
    for (const item of items) await expect(Math.round(item.getBoundingClientRect().width)).toBe(cardMax());
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
    await expect(canvas.getByRole('listitem').getBoundingClientRect().width).toBeLessThanOrEqual(cardMax());
  },
};

/** Two across at 390; the third stay starts a row 48px lower. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(2);
    await expect(gridGaps(canvas.getAllByRole('listitem'))).toEqual({ column: 24, row: 48 });
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
