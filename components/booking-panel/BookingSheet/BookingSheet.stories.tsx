import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { DepartureList } from '@/components/departures/DepartureList/DepartureList';
import { realUser } from '../../../.storybook/realUser';
import { BookingStickyBar } from '../BookingStickyBar/BookingStickyBar';
import {
  messageOf,
  sampleBookingCopy,
  sampleBookingSettings,
  sampleBookingTokens,
  sampleBookingTour,
  samplePaymentMethods,
  withBooking,
} from '../sampleBooking';
import { BookingSheet } from './BookingSheet';

/** The sticky bar, found from its Reserve button. */
const bar = (canvas: ReturnType<typeof within>) =>
  within(canvas.getByRole('button', { name: 'Reserve' }).closest('[data-surface]') as HTMLElement);

/** Below 1100px: the departure rows, the sticky bar and the sheet, sharing one booking. */
const meta = {
  title: 'Booking panel/BookingSheet',
  component: BookingSheet,
  args: {
    subtitle: '9 days, 8 nights · from Lahore',
    tour: sampleBookingTour,
    copy: sampleBookingCopy.booking,
    tokens: sampleBookingTokens,
    settings: sampleBookingSettings,
    paymentMethods: samplePaymentMethods,
  },
  render: (args) => (
    <>
      <DepartureList tour={sampleBookingTour} copy={sampleBookingCopy.dates} settings={sampleBookingSettings} />
      <BookingStickyBar
        tour={sampleBookingTour}
        copy={sampleBookingCopy.bar}
        priceNote={sampleBookingCopy.booking.priceNote}
        settings={sampleBookingSettings}
      />
      <BookingSheet {...args} />
    </>
  ),
  decorators: [withBooking()],
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof BookingSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reserve on the bar opens a modal named by the tour; Escape closes it and focus returns to Reserve. */
export const FromTheBar: Story = {
  play: async ({ canvas, canvasElement }) => {
    const reserve = canvas.getByRole('button', { name: 'Reserve' });
    await expect(bar(canvas).getByText('per person · twin sharing')).toBeVisible();
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask about Hunza & Skardu Grand on WhatsApp' }))).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 12 May 2099.',
    );
    const user = await realUser();
    if (!user) return;
    await user.click(reserve);
    const sheet = await waitFor(() => canvasElement.ownerDocument.querySelector('dialog[open]') as HTMLDialogElement);
    await expect(sheet).toHaveAccessibleName('Hunza & Skardu Grand');
    await expect(sheet).toHaveTextContent('9 days, 8 nights · from Lahore');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(sheet).not.toHaveAttribute('open'));
    await expect(reserve).toHaveFocus();
  },
};

/** "Select date" on a row opens the sheet with that date chosen; the bar shows the date. */
export const FromARow: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Select date, 26 May – 3 Jun' }));
    const sheet = await waitFor(() => canvasElement.ownerDocument.querySelector('dialog[open]') as HTMLDialogElement);
    await expect(sheet.querySelector<HTMLInputElement>('input[value="2099-05-26"]')).toBeChecked();
    sheet.close();
    await waitFor(() => expect(bar(canvas).getByText('per person · 26 May – 3 Jun')).toBeVisible());
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask about Hunza & Skardu Grand on WhatsApp' }))).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 26 May 2099.',
    );
  },
};

/** A full date: the bar says so. */
export const SoldOutDate: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reserve' }));
    const sheet = await waitFor(() => canvasElement.ownerDocument.querySelector('dialog[open]') as HTMLDialogElement);
    await userEvent.click(sheet.querySelector<HTMLInputElement>('input[value="2099-06-09"]')!);
    sheet.close();
    await waitFor(() => expect(bar(canvas).getByText('per person · 9–17 Jun · sold out')).toBeVisible());
  },
};

export const FromTheBarOnLight: Story = { ...FromTheBar, globals: { surface: 'light', viewport: { value: 'phone' } } };
