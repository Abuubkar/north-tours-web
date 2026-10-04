import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleBookingCopy, sampleBookingTour } from '@/components/booking-panel/sampleBooking';
import { RoomSharingList } from './RoomSharingList';

const meta = {
  title: 'Departures/RoomSharingList',
  component: RoomSharingList,
  args: {
    copy: sampleBookingCopy.dates.rooms,
    note: 'Prices are per person. Children under 5 share their parents’ room free.',
    prices: sampleBookingTour.prices,
  },
  globals: { surface: 'light' },
} satisfies Meta<typeof RoomSharingList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A heading over the three rooms and their prices per person, then the note. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Room sharing' })).toBeVisible();
    await expect(canvas.getAllByRole('term').map((t) => t.firstChild?.textContent)).toEqual(['Twin sharing', 'Triple sharing', 'Quad sharing']);
    await expect(canvas.getAllByRole('definition').map((d) => d.textContent)).toEqual(['PKR 145,000', 'PKR 135,000', 'PKR 127,000']);
    await expect(canvas.getByText(/Children under 5/)).toBeVisible();
  },
};

export const OnDark: Story = { ...Default, globals: { surface: 'dark' } };
