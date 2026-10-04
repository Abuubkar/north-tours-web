import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { sampleBookingCopy, sampleBookingTour, sampleDepartures } from '@/components/booking-panel/sampleBooking';
import { DepartureRow } from './DepartureRow';

const meta = {
  title: 'Departures/DepartureRow',
  component: DepartureRow,
  args: {
    departure: sampleDepartures[1],
    tour: sampleBookingTour,
    copy: sampleBookingCopy.dates,
    selected: false,
    onSelect: fn(),
    waitlistHref: 'https://wa.me/?text=waitlist',
  },
  render: (args) => (
    <ul>
      <DepartureRow {...args} />
    </ul>
  ),
  globals: { surface: 'light' },
} satisfies Meta<typeof DepartureRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Select date", named by its date. */
export const Open: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Select date, 26 May – 3 Jun', pressed: false }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
  },
};

export const OpenOnDark: Story = { ...Open, globals: { surface: 'dark' } };

/** The chosen date: pressed, reading "Selected", in the shared selected state (never gold). */
export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Selected, 26 May – 3 Jun', pressed: true })).toBeVisible();
  },
};

export const SelectedOnDark: Story = { ...Selected, globals: { surface: 'dark' } };

/** Sold out: "Join waitlist" opens the waitlist message. */
export const SoldOut: Story = {
  args: { departure: sampleDepartures[2] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Join waitlist, 9–17 Jun' })).toHaveAttribute('href', 'https://wa.me/?text=waitlist');
    await expect(canvas.getByText('Sold out · waitlist open')).toBeVisible();
  },
};

export const SoldOutPhone: Story = { ...SoldOut, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** A date with its own prices shows its own twin price. */
export const OwnPrices: Story = {
  args: { departure: { ...sampleDepartures[3], prices: { twin: 160000, triple: 150000, quad: 140000 } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('PKR 160,000')).toBeVisible();
  },
};
