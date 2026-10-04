import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import {
  asideWidth,
  messageOf,
  sampleBookingCopy,
  sampleBookingSettings,
  sampleBookingTokens,
  sampleBookingTour,
  sampleDepartures,
  samplePaymentMethods,
  withBooking,
} from '../sampleBooking';
import { BookingPanel } from './BookingPanel';

const meta = {
  title: 'Booking panel/BookingPanel',
  component: BookingPanel,
  // The list form; the aside's panel shows it only on screens 920px or taller (see Compact).
  args: {
    variant: 'sheet',
    tour: sampleBookingTour,
    copy: sampleBookingCopy.booking,
    tokens: sampleBookingTokens,
    settings: sampleBookingSettings,
    paymentMethods: samplePaymentMethods,
  },
  decorators: [asideWidth, withBooking()],
} satisfies Meta<typeof BookingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;
const dateRadio = (canvas: Canvas, dates: string) => canvas.getByRole('radio', { name: new RegExp(`^${dates}`) });
const travellers = (canvas: Canvas) => canvas.getByRole('group', { name: 'Travellers' }).querySelector('output')!;

/** No date yet: "from", the total waits for a date, and Reserve is disabled but focusable. */
export const NoDate: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('from').parentElement).toHaveTextContent('fromPKR 145,000per person · twin sharing');
    await expect(canvas.getByRole('group', { name: 'Departure date' })).toBeVisible();
    await expect(canvas.getAllByRole('radio', { checked: true })).toHaveLength(1);
    await expect(canvas.getByText('Choose a date')).toBeVisible();
    const reserve = canvas.getByRole('button', { name: 'Reserve with 30% advance' });
    await expect(reserve).toHaveAttribute('aria-disabled', 'true');
    await expect(travellers(canvas)).toHaveTextContent('2');
    await expect(canvas.getByText('Adults and children 5+')).toBeVisible();
    await expect(canvas.getByText('Cash · Bank transfer')).toBeVisible();
    await expect(canvas.getByText('Cancel 14 or more days before departure for a full refund of your advance.')).toBeVisible();
    // With no date, Ask on WhatsApp names the next departure with seats.
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask on WhatsApp' }))).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 12 May 2099.',
    );
  },
};

export const NoDateOnLight: Story = { ...NoDate, globals: { surface: 'light' } };

/** Arrow keys move between the dates; Tab then reaches the travellers and the rooms. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    dateRadio(canvas, '12–20 May').focus();
    await user.keyboard('{ArrowDown}');
    await expect(dateRadio(canvas, '26 May – 3 Jun')).toBeChecked();
    await expect(dateRadio(canvas, '26 May – 3 Jun')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    await expect(dateRadio(canvas, '9–17 Jun')).toBeChecked();
    await user.tab();
    await expect(canvas.getByRole('button', { name: 'Fewer travellers' })).toHaveFocus();
    await user.tab();
    await expect(canvas.getByRole('button', { name: 'More travellers' })).toHaveFocus();
    await user.tab();
    await expect(canvas.getByRole('radio', { name: /^Twin/ })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: /^Triple/ })).toBeChecked();
  },
};

/**
 * A date chosen: its twin price, "2 × PKR 145,000", the total and the advance, and Reserve opens
 * WhatsApp with everything filled in. The rooms change the total.
 */
export const DateChosen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(dateRadio(canvas, '26 May – 3 Jun'));
    await expect(canvas.queryByText('from')).toBeNull();
    await expect(canvas.getByText('2 × PKR 145,000')).toBeVisible();
    await expect(canvas.getByText('PKR 290,000')).toBeVisible();
    await expect(canvas.getByText('Advance to reserve: PKR 87,000 (30% of total)')).toBeVisible();
    const reserve = canvas.getByRole('link', { name: 'Reserve with 30% advance' });
    await expect(messageOf(reserve)).toBe(
      'Hi, I’d like to reserve 2 travellers on Hunza & Skardu Grand, 26 May – 3 Jun 2099, twin sharing. Total PKR 290,000; I’ll pay the 30% advance of PKR 87,000.',
    );

    await userEvent.click(canvas.getByRole('radio', { name: 'Quad PKR 127,000' }));
    await expect(canvas.getByText('2 × PKR 127,000')).toBeVisible();
    await expect(canvas.getByText('PKR 254,000')).toBeVisible();
    await expect(canvas.getByText('Advance to reserve: PKR 76,200 (30% of total)')).toBeVisible();
    await expect(messageOf(canvas.getByRole('link', { name: 'Reserve with 30% advance' }))).toMatch(/, quad sharing\. Total PKR 254,000;/);
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask on WhatsApp' }))).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 26 May 2099.',
    );
  },
};

export const DateChosenOnLight: Story = { ...DateChosen, globals: { surface: 'light' } };

export const DateChosenPhone: Story = { ...DateChosen, globals: { viewport: { value: 'phone' } } };

/** + and − change the travellers and stop at the date's seats left; a date with fewer seats brings them down. */
export const Travellers: Story = {
  play: async ({ canvas, userEvent }) => {
    const more = canvas.getByRole('button', { name: 'More travellers' });
    await userEvent.click(dateRadio(canvas, '26 May – 3 Jun'));
    await userEvent.click(more);
    await userEvent.click(more);
    await userEvent.click(more);
    await expect(travellers(canvas)).toHaveTextContent('5');
    await userEvent.click(canvas.getByRole('button', { name: 'Fewer travellers' }));
    await expect(travellers(canvas)).toHaveTextContent('4');

    await userEvent.click(dateRadio(canvas, '12–20 May'));
    await expect(travellers(canvas)).toHaveTextContent('3');
    await expect(more).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(more);
    await expect(travellers(canvas)).toHaveTextContent('3');
    // Through a sold-out date (one traveller, for its waitlist) and on to a bigger one, the
    // number asked for comes back.
    await userEvent.click(dateRadio(canvas, '9–17 Jun'));
    await expect(travellers(canvas)).toHaveTextContent('1');
    await userEvent.click(dateRadio(canvas, '23 Jun – 1 Jul'));
    await expect(travellers(canvas)).toHaveTextContent('4');
    await expect(canvas.getByText('4 × PKR 145,000')).toBeVisible();
  },
};

/** A date with its own room prices (e.g. Eid): the panel's price, rooms and total use them. */
export const OwnPrices: Story = {
  decorators: [
    withBooking([{ ...sampleDepartures[1], prices: { twin: 160000, triple: 150000, quad: 140000 } }, sampleDepartures[3]]),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(dateRadio(canvas, '26 May – 3 Jun'));
    await expect(canvas.getByRole('radio', { name: 'Triple PKR 150,000' })).toBeInTheDocument();
    await expect(canvas.getByText('2 × PKR 160,000')).toBeVisible();
    await expect(canvas.getByText('PKR 320,000')).toBeVisible();
    await expect(canvas.getByText('Advance to reserve: PKR 96,000 (30% of total)')).toBeVisible();
  },
};

/** A sold-out date: it's full, and the waitlist replaces Reserve. */
export const SoldOutDate: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(dateRadio(canvas, '9–17 Jun'));
    await expect(
      canvas.getByText('9–17 Jun is full. Join the waitlist and we’ll message you on WhatsApp if a seat opens.'),
    ).toBeVisible();
    await expect(canvas.queryByRole('link', { name: /^Reserve/ })).toBeNull();
    await expect(messageOf(canvas.getByRole('link', { name: 'Join waitlist' }))).toBe(
      'Hi, please add me to the waitlist for Hunza & Skardu Grand on 9 Jun 2099 in case a seat opens up.',
    );
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask on WhatsApp' }))).toBe(
      'Hi, I’m interested in Hunza & Skardu Grand on 9 Jun 2099.',
    );
  },
};

export const SoldOutDateOnLight: Story = { ...SoldOutDate, globals: { surface: 'light' } };

/** A date that left after the build is dropped in the browser. */
export const StaleBuild: Story = {
  decorators: [withBooking([{ start: '2020-06-01', end: '2020-06-09', seatsTotal: 16, seatsLeft: 4 }])],
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('No upcoming dates · ask on WhatsApp')).toBeVisible());
    await expect(canvas.queryByRole('radio', { name: /^1–9 Jun/ })).toBeNull();
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask on WhatsApp' }))).toBe('Hi, I’d like to plan a trip north.');
  },
};

/**
 * At 1366×768 (shorter than 920px) the aside's panel picks its date from a select named by its
 * label, with each date's seats; the footer stays on screen.
 */
export const Compact: Story = {
  args: { variant: 'aside' },
  globals: { viewport: { value: 'laptop' } },
  play: async ({ canvas, userEvent }) => {
    const select = await canvas.findByRole('combobox', { name: 'Departure date' });
    await expect(canvas.queryByRole('radio', { name: /May/ })).toBeNull();
    await expect(canvas.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Choose a departure',
      '12–20 May · 3 of 16 seats left',
      '26 May – 3 Jun · 9 of 16 seats left',
      '9–17 Jun · Sold out · waitlist open',
      '23 Jun – 1 Jul · 14 of 16 seats left',
    ]);
    await userEvent.selectOptions(select, '26 May – 3 Jun · 9 of 16 seats left');
    await expect(canvas.getByText('PKR 290,000')).toBeVisible();
    const reserve = canvas.getByRole('link', { name: 'Reserve with 30% advance' });
    await expect(reserve.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
  },
};

export const CompactOnLight: Story = { ...Compact, globals: { surface: 'light', viewport: { value: 'laptop' } } };

/** In the sheet the panel always lists its dates, whatever the screen's height. */
export const InSheet: Story = {
  globals: { viewport: { value: 'laptop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('combobox')).toBeNull();
    await expect(dateRadio(canvas, '12–20 May')).toBeVisible();
  },
};

export const InSheetOnLight: Story = { ...InSheet, globals: { surface: 'light', viewport: { value: 'laptop' } } };

/** The aside's panel on a screen 920px or taller: the list of dates. */
export const AsideTall: Story = {
  args: { variant: 'aside' },
  globals: { viewport: { value: 'desktopTall' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('combobox')).toBeNull();
    await expect(canvas.getByRole('group', { name: 'Departure date' })).toBeVisible();
  },
};
