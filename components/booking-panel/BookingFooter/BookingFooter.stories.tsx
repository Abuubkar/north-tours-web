import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { BookingContext, type Booking } from '@/hooks/useBooking';
import {
  asideWidth,
  messageOf,
  sampleBookingCopy,
  sampleBookingSettings,
  sampleBookingTokens,
  sampleBookingTour,
  sampleDepartures,
} from '../sampleBooking';
import { BookingFooter } from './BookingFooter';

/** A fixed booking, so each story shows one state of the footer. */
const booking = (chosen: Booking['chosen'], travellers = 2): Booking => ({
  today: '2020-01-01',
  departures: sampleDepartures,
  chosen,
  travellers,
  maxTravellers: 16,
  room: 'twin',
  choose: () => {},
  setTravellers: () => {},
  setRoom: () => {},
});

const meta = {
  title: 'Booking panel/BookingFooter',
  component: BookingFooter,
  args: { tour: sampleBookingTour, copy: sampleBookingCopy.booking, tokens: sampleBookingTokens, settings: sampleBookingSettings },
  decorators: [asideWidth],
} satisfies Meta<typeof BookingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No date: the total waits, and Reserve is aria-disabled. */
export const NoDate: Story = {
  decorators: [(Story) => <BookingContext value={booking(undefined)}>{Story()}</BookingContext>],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Choose a date')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Reserve with 30% advance' })).toHaveAttribute('aria-disabled', 'true');
  },
};

export const NoDateOnLight: Story = { ...NoDate, globals: { surface: 'light' } };

/** One traveller: the message says "1 traveller". */
export const OneTraveller: Story = {
  decorators: [(Story) => <BookingContext value={booking(sampleDepartures[0], 1)}>{Story()}</BookingContext>],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1 × PKR 145,000')).toBeVisible();
    await expect(messageOf(canvas.getByRole('link', { name: 'Reserve with 30% advance' }))).toMatch(/^Hi, I’d like to reserve 1 traveller on /);
  },
};

export const OneTravellerOnLight: Story = { ...OneTraveller, globals: { surface: 'light' } };

/** Sold out: the waitlist. */
export const SoldOut: Story = {
  decorators: [(Story) => <BookingContext value={booking(sampleDepartures[2])}>{Story()}</BookingContext>],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Join waitlist' })).toBeVisible();
  },
};

export const SoldOutOnLight: Story = { ...SoldOut, globals: { surface: 'light' } };
