import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDays, sampleMiniDrawing } from '../sampleItinerary';
import { DayMiniMap } from './DayMiniMap';

const meta = {
  title: 'Itinerary/DayMiniMap',
  component: DayMiniMap,
  args: { drawing: sampleMiniDrawing, day: 2, stops: sampleDays[2].stops },
} satisfies Meta<typeof DayMiniMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Where the day starts and ends; hidden from screen readers, as the day's text says the same. */
export const MiddleDay: Story = {
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('[aria-hidden="true"]')!;
    await expect(map).toHaveTextContent('ChilasHunza');
    await expect(map.querySelector('path:last-of-type')).toHaveAttribute('stroke-dashoffset', String(1 - sampleMiniDrawing.progress[2]));
  },
};

export const MiddleDayOnLight: Story = { ...MiddleDay, globals: { surface: 'light' } };

/** A day in one place has one label. */
export const OnePlace: Story = {
  args: { day: 3, stops: sampleDays[3].stops },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).toHaveTextContent(/^Hunza$/);
  },
};

export const OnePlacePhone: Story = { ...OnePlace, globals: { viewport: { value: 'phone' } } };

export const OnePlaceOnLight: Story = { ...OnePlace, globals: { surface: 'light' } };

export const MiddleDayLaptop: Story = { ...MiddleDay, globals: { viewport: { value: 'laptop' } } };

export const MiddleDayDesktop: Story = { ...MiddleDay, globals: { viewport: { value: 'desktop' } } };
