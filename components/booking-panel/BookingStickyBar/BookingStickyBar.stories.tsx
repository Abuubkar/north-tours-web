import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { messageOf, sampleBookingCopy, sampleBookingSettings, sampleBookingTour, withBooking } from '../sampleBooking';
import { BookingStickyBar } from './BookingStickyBar';

const meta = {
  title: 'Booking panel/BookingStickyBar',
  component: BookingStickyBar,
  args: {
    tour: sampleBookingTour,
    copy: sampleBookingCopy.bar,
    priceNote: sampleBookingCopy.booking.priceNote,
    settings: sampleBookingSettings,
  },
  decorators: [withBooking()],
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof BookingStickyBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The "from" price, Reserve and a 48px WhatsApp button named by the tour. */
export const Phone: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('from')).toBeVisible();
    await expect(canvas.getByText('PKR 145,000')).toBeVisible();
    await expect(canvas.getByText('per person · twin sharing')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Reserve' }).getBoundingClientRect().height).toBe(48);
    const ask = canvas.getByRole('link', { name: 'Ask about Hunza & Skardu Grand on WhatsApp' });
    await expect(messageOf(ask)).toBe('Hi, I’m interested in Hunza & Skardu Grand on 12 May 2099.');
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** From 1100px the bar isn't shown: the aside takes over. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Reserve' })).toBeNull();
  },
};
