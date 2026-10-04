import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { BookingPanel } from '@/components/booking-panel/BookingPanel/BookingPanel';
import {
  messageOf,
  sampleBookingCopy,
  sampleBookingSettings,
  sampleBookingTokens,
  sampleBookingTour,
  sampleDepartures,
  samplePaymentMethods,
  withBooking,
} from '@/components/booking-panel/sampleBooking';
import { DepartureList } from './DepartureList';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Departures/DepartureList',
  component: DepartureList,
  args: { tour: sampleBookingTour, copy: sampleBookingCopy.dates, settings: sampleBookingSettings },
  decorators: [withBooking()],
  globals: { surface: 'light' },
} satisfies Meta<typeof DepartureList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every date with its seats and twin price; a sold-out date offers the waitlist. */
export const Rows: Story = {
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole('listitem');
    await expect(rows).toHaveLength(4);
    await expect(rows[0]).toHaveTextContent('12–20 May9 days, 8 nights · departs Lahore3 of 16 seats leftPKR 145,000per person, twin');
    await expect(canvas.getByRole('button', { name: 'Select date, 12–20 May', pressed: false })).toBeVisible();
    const waitlist = canvas.getByRole('link', { name: 'Join waitlist, 9–17 Jun' });
    await expect(messageOf(waitlist)).toBe('Hi, please add me to the waitlist for Hunza & Skardu Grand on 9 Jun 2099 in case a seat opens up.');
    await expect(canvas.queryByRole('button', { name: /9–17 Jun/ })).toBeNull();
  },
};

export const RowsOnDark: Story = { ...Rows, globals: { surface: 'dark' } };

export const RowsPhone: Story = { ...Rows, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const RowsDesktop: Story = { ...Rows, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** "Select date" chooses that date in the booking panel and is marked pressed, reading (and named) "Selected". */
export const SelectsInPanel: Story = {
  render: (args) => (
    <div className={styles.stack}>
      <DepartureList {...args} />
      <div className={styles.aside} data-surface="dark">
        <BookingPanel
          variant="sheet"
          tour={sampleBookingTour}
          copy={sampleBookingCopy.booking}
          tokens={sampleBookingTokens}
          settings={sampleBookingSettings}
          paymentMethods={samplePaymentMethods}
        />
      </div>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole('button', { name: 'Select date, 26 May – 3 Jun' });
    await userEvent.click(select);
    await expect(select).toHaveAttribute('aria-pressed', 'true');
    await expect(select).toHaveAccessibleName('Selected, 26 May – 3 Jun');
    await expect(canvas.getByRole('radio', { name: /^26 May – 3 Jun/ })).toBeChecked();
    await expect(canvas.getByText('PKR 290,000')).toBeVisible();

    // Choosing in the panel marks the row too.
    await userEvent.click(canvas.getByRole('radio', { name: /^23 Jun – 1 Jul/ }));
    await expect(canvas.getByRole('button', { name: 'Selected, 23 Jun – 1 Jul' })).toHaveAttribute('aria-pressed', 'true');
    await expect(select).toHaveAttribute('aria-pressed', 'false');
  },
};

/** A date that left after the build is dropped in the browser. */
export const StaleBuild: Story = {
  decorators: [withBooking([{ start: '2020-06-01', end: '2020-06-09', seatsTotal: 16, seatsLeft: 4 }, ...sampleDepartures])],
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(4));
    await expect(canvas.queryByText('1–9 Jun')).toBeNull();
  },
};

/** No dates left: WhatsApp instead. */
export const NoneLeft: Story = {
  decorators: [withBooking([])],
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('paragraph')).getByRole('link', { name: 'No upcoming dates · ask on WhatsApp' })).toBeVisible();
  },
};
