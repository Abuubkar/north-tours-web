import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { drawsLines, gridColumns, gridGaps } from '../../../.storybook/gridColumns';
import { emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { placeholderSettings } from '../../layout/sampleSettings';
import { openDeparture, tourWith } from '../sampleTours';
import { TourCardGrid } from './TourCardGrid';

const cards = ['Hunza Express', 'Swat Family Escape', 'Naran-Kaghan Getaway', 'Murree & Galiyat Weekend'].map((title) => ({
  tour: tourWith(title, []),
  departure: openDeparture,
}));

const meta = {
  title: 'Tour card/TourCardGrid',
  component: TourCardGrid,
  args: { cards, maxColumns: 4, settings: placeholderSettings },
  beforeEach: emulateReducedMotion,
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TourCardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Homepage: up to four across, 24px apart, with no lines between the cards. */
export const FourColumns: Story = {
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(4);
    await expect(gridGaps(items).column).toBe(24);
    for (const element of [canvas.getByRole('list'), ...items]) await expect(drawsLines(element)).toBe(false);
  },
};

export const FourColumnsOnLight: Story = { ...FourColumns, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Tour Detail: up to three across; the fourth card starts a row 48px lower. The column math allows for the 24px gaps. */
export const ThreeColumns: Story = {
  args: { maxColumns: 3 },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(3);
    await expect(gridGaps(items)).toEqual({ column: 24, row: 48 });
    const list = canvas.getByRole('list').getBoundingClientRect();
    await expect(Math.round(items[2].getBoundingClientRect().right)).toBe(Math.round(list.right));
  },
};

export const ThreeColumnsOnLight: Story = { ...ThreeColumns, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const ThreeColumnsPhone: Story = {
  args: { maxColumns: 3 },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(1);
    await expect(gridGaps(items).row).toBe(48);
  },
};
