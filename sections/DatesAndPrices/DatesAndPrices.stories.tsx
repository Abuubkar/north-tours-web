import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleBookingCopy, sampleBookingSettings, sampleBookingTour, withBooking } from '@/components/booking-panel/sampleBooking';
import { BookingLayout } from '../BookingLayout/BookingLayout';
import { DatesAndPrices } from './DatesAndPrices';

const meta = {
  title: 'Sections/DatesAndPrices',
  component: DatesAndPrices,
  args: {
    tour: sampleBookingTour,
    copy: sampleBookingCopy.dates,
    settings: sampleBookingSettings,
    roomsNote: 'Prices are per person. Children under 5 share their parents’ room free.',
  },
  // In the page's main column, which carries the page margin the section bleeds into.
  decorators: [
    (Story) => (
      <BookingLayout label="Book this tour" aside={<p>Booking panel</p>}>
        <Story />
      </BookingLayout>
    ),
    withBooking(),
  ],
  parameters: { fullBleed: true },
} satisfies Meta<typeof DatesAndPrices>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A light section (#dates): the headline, every date, then the room prices. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const section = canvasElement.querySelector('section')!;
    await expect(section).toHaveAttribute('id', 'dates');
    await expect(section).toHaveAttribute('data-surface', 'light');
    await expect(canvas.getByRole('heading', { level: 2, name: 'Upcoming departures and prices' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Room sharing' })).toBeVisible();
  },
};

/** At 390 it fills the width and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };
