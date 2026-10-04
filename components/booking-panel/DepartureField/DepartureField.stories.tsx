import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { asideWidth, sampleBookingCopy, withBooking } from '../sampleBooking';
import { DepartureField } from './DepartureField';

const meta = {
  title: 'Booking panel/DepartureField',
  component: DepartureField,
  args: { copy: sampleBookingCopy.booking, compact: false },
  decorators: [asideWidth, withBooking()],
} satisfies Meta<typeof DepartureField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A named group of date radios. */
export const List: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Departure date' })).toBeVisible();
    await expect(canvas.getAllByRole('radio')).toHaveLength(4);
  },
};

export const ListOnLight: Story = { ...List, globals: { surface: 'light' } };

/** Compact: a select; once a date is chosen its seats show under it. */
export const Compact: Story = {
  args: { compact: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Departure date' }), '12–20 May · 3 of 16 seats left');
    await expect(canvas.getByText('3 of 16 seats left')).toBeVisible();
  },
};

export const CompactOnLight: Story = { ...Compact, globals: { surface: 'light' } };

/** No dates left. */
export const NoneLeft: Story = {
  decorators: [withBooking([])],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
  },
};
