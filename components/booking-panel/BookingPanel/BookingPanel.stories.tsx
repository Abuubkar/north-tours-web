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
  withBooking,
} from '../sampleBooking';
import { BookingPanel } from './BookingPanel';

const meta = {
  title: 'Booking panel/BookingPanel',
  component: BookingPanel,
  args: {
    tour: sampleBookingTour,
    copy: sampleBookingCopy.booking,
    tokens: sampleBookingTokens,
    settings: sampleBookingSettings,
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
    // Back on a bigger date, the travellers stay where they were brought down to.
    await userEvent.click(dateRadio(canvas, '23 Jun – 1 Jul'));
    await expect(travellers(canvas)).toHaveTextContent('3');
    await expect(canvas.getByText('3 × PKR 145,000')).toBeVisible();
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
    const dates = canvas.getByRole('group', { name: 'Departure date' });
    await waitFor(() => expect(within(dates).queryAllByRole('radio')).toHaveLength(0));
    await expect(canvas.getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
    await expect(messageOf(canvas.getByRole('link', { name: 'Ask on WhatsApp' }))).toBe('Hi, I’d like to plan a trip north.');
  },
};
