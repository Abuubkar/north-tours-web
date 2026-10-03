import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { SeatsStatus } from './SeatsStatus';

const meta = {
  title: 'Tour/SeatsStatus',
  component: SeatsStatus,
  args: { departure: { seatsLeft: 11, seatsTotal: 20 } },
} satisfies Meta<typeof SeatsStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('11 of 20 seats left')).toBeVisible();
  },
};

export const OpenOnLight: Story = { ...Open, globals: { surface: 'light' } };

/** Three seats or fewer: gold. */
export const Urgent: Story = {
  args: { departure: { seatsLeft: 3, seatsTotal: 16 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('3 of 16 seats left')).toBeVisible();
  },
};

export const UrgentOnLight: Story = { ...Urgent, globals: { surface: 'light' } };

export const SoldOut: Story = {
  args: { departure: { seatsLeft: 0, seatsTotal: 12 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sold out · waitlist open')).toBeVisible();
  },
};

export const SoldOutOnLight: Story = { ...SoldOut, globals: { surface: 'light' } };
