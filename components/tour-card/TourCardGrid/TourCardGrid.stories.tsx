import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
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

/** The Homepage: up to four across. */
export const FourColumns: Story = {
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(4);
  },
};

export const FourColumnsOnLight: Story = { ...FourColumns, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Tour Detail and Destination: up to three across. */
export const ThreeColumns: Story = {
  args: { maxColumns: 3 },
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(3);
  },
};

export const ThreeColumnsPhone: Story = {
  args: { maxColumns: 3 },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(1);
  },
};
