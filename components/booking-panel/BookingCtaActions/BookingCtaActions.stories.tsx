import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { BookingLayout } from '@/sections/BookingLayout/BookingLayout';
import { DatesAndPrices } from '@/sections/DatesAndPrices/DatesAndPrices';
import { BookingPanel } from '../BookingPanel/BookingPanel';
import { BookingSheet } from '../BookingSheet/BookingSheet';
import {
  messageOf,
  sampleBookingCopy,
  sampleBookingSettings,
  sampleBookingTokens,
  sampleBookingTour,
  samplePaymentMethods,
  withBooking,
} from '../sampleBooking';
import { BookingCtaActions } from './BookingCtaActions';

const panel = {
  tour: sampleBookingTour,
  copy: sampleBookingCopy.booking,
  tokens: sampleBookingTokens,
  settings: sampleBookingSettings,
  paymentMethods: samplePaymentMethods,
};

/** The page around the buttons: Dates and prices beside the aside, and the sheet. */
const meta = {
  title: 'Booking panel/BookingCtaActions',
  component: BookingCtaActions,
  args: {
    tour: sampleBookingTour.title,
    reserveLabel: 'Reserve with 30% advance',
    askLabel: 'Ask on WhatsApp',
    settings: sampleBookingSettings,
  },
  render: (args) => (
    <>
      <BookingLayout label="Book this tour" aside={<BookingPanel variant="aside" {...panel} />}>
        <DatesAndPrices tour={sampleBookingTour} copy={sampleBookingCopy.dates} settings={sampleBookingSettings} roomsNote="Prices are per person." />
      </BookingLayout>
      <BookingCtaActions {...args} />
      <BookingSheet subtitle="9 days, 8 nights · from Lahore" {...panel} />
    </>
  ),
  decorators: [withBooking()],
  parameters: { fullBleed: true },
} satisfies Meta<typeof BookingCtaActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * At 1440, Reserve takes the visitor to the date choice: focus moves to the panel's date control
 * (a select, the screen being under 920px tall). It never opens WhatsApp; without JavaScript it's a link to #dates.
 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const reserve = canvas.getByRole('link', { name: 'Reserve with 30% advance' });
    await expect(reserve).toHaveAttribute('href', '#dates');
    await userEvent.click(reserve);
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Departure date' })).toHaveFocus());
    await expect(canvasElement.ownerDocument.querySelector('dialog[open]')).toBeNull();
    // The last "Ask on WhatsApp" is the call to action's; the first is the aside panel's.
    await expect(messageOf(canvas.getAllByRole('link', { name: 'Ask on WhatsApp' }).at(-1)!)).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 12 May 2099.',
    );
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a screen 920px or taller the aside lists its dates, and Reserve focuses the first one. */
export const DesktopTall: Story = {
  globals: { viewport: { value: 'desktopTall' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Reserve with 30% advance' }));
    await waitFor(() => expect(canvas.getAllByRole('radio', { name: /^12–20 May/ })[0]).toHaveFocus());
  },
};

/** At 390, Reserve opens the booking sheet. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Reserve with 30% advance' }));
    const sheet = await waitFor(() => canvasElement.ownerDocument.querySelector('dialog[open]') as HTMLDialogElement);
    await expect(sheet).toHaveAccessibleName('Hunza & Skardu Grand');
    sheet.close();
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
