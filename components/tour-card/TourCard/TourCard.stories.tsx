import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { placeholderSettings, realSettings } from '../../layout/sampleSettings';
import { openDeparture, sampleTour, soldOutDeparture, urgentDeparture } from '../sampleTours';
import { TourCard } from './TourCard';
import styles from '../../ui/stories.module.css';

const TOUR_MESSAGE = encodeURIComponent('Hi, I’m interested in Hunza & Skardu Grand on 26 May 2027.');
const WAITLIST_MESSAGE = encodeURIComponent(
  'Hi, please add me to the waitlist for Hunza & Skardu Grand on 9 Jun 2027 in case a seat opens up.',
);

const meta = {
  title: 'Tour card/TourCard',
  component: TourCard,
  args: { tour: sampleTour, departure: openDeparture, settings: placeholderSettings },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TourCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dates, price, rating and seats; View Trip to the tour page and WhatsApp with the tour and date. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Hunza & Skardu Grand' })).toBeVisible();
    await expect(canvas.getByText('26 May – 3 Jun · 9 days, 8 nights')).toBeVisible();
    await expect(canvas.getByText('PKR 145,000')).toBeVisible();
    await expect(canvas.getByRole('img', { name: '4.9 out of 5, 128 reviews' })).toBeVisible();
    await expect(canvas.getByText('9 of 16 seats left')).toBeVisible();
    const viewTrip = canvas.getByRole('link', { name: 'View Trip, Hunza & Skardu Grand' });
    await expect(viewTrip).toHaveAttribute('href', '/tours/hunza-skardu-grand');
    await expect(viewTrip).toHaveTextContent(/^View Trip$/);
    // While the number is a placeholder the link has no number.
    await expect(canvas.getByRole('link', { name: 'Ask about Hunza & Skardu Grand on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/?text=${TOUR_MESSAGE}`,
    );
    await expect(canvas.queryByText('Sold out')).toBeNull();
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const DefaultPhone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const DefaultDesktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

/** With a real number, the WhatsApp link carries its digits. */
export const RealNumber: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Ask about Hunza & Skardu Grand on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?text=${TOUR_MESSAGE}`,
    );
  },
};

/** Hover (a real pointer, in the test run only): the card lifts to the raised surface and the photo zooms. */
export const Hover: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const card = canvas.getByRole('article');
    const resting = getComputedStyle(card).backgroundColor;
    await user.hover(canvas.getByRole('heading', { level: 3 }));
    await waitFor(() => expect(getComputedStyle(card).backgroundColor).not.toBe(resting));
  },
};

/** Three seats or fewer: the "Only 3 seats left" tag and a gold seats line. */
export const Urgent: Story = {
  args: { departure: urgentDeparture },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Only 3 seats left')).toBeVisible();
    await expect(canvas.getByText('3 of 16 seats left')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'View Trip, Hunza & Skardu Grand' })).toBeVisible();
  },
};

export const UrgentOnLight: Story = { ...Urgent, globals: { surface: 'light' } };

export const UrgentPhone: Story = { ...Urgent, globals: { viewport: { value: 'phone' } } };

/** Sold out: the tag, "Sold out · waitlist open", and both actions carry the waitlist message. No hover. */
export const SoldOut: Story = {
  args: { departure: soldOutDeparture, settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sold out')).toBeVisible();
    await expect(canvas.getByText('Sold out · waitlist open')).toBeVisible();
    await expect(canvas.queryByRole('link', { name: /View Trip/ })).toBeNull();
    const waitlist = `https://wa.me/923001234567?text=${WAITLIST_MESSAGE}`;
    await expect(canvas.getByRole('link', { name: 'Join waitlist, Hunza & Skardu Grand' })).toHaveAttribute('href', waitlist);
    await expect(
      canvas.getByRole('link', { name: 'Join the waitlist for Hunza & Skardu Grand on WhatsApp' }),
    ).toHaveAttribute('href', waitlist);

    const user = await realUser();
    if (!user) return;
    const card = canvas.getByRole('article');
    const resting = getComputedStyle(card).backgroundColor;
    await user.hover(canvas.getByRole('heading', { level: 3 }));
    await expect(getComputedStyle(card).backgroundColor).toBe(resting);
  },
};

export const SoldOutOnLight: Story = { ...SoldOut, globals: { surface: 'light' } };

export const SoldOutDesktop: Story = { ...SoldOut, globals: { viewport: { value: 'desktop' } } };

/** Until the tour's photo exists, the striped placeholder names the shot. */
export const PlaceholderPhoto: Story = {
  args: { tour: { ...sampleTour, image: { placeholder: 'Attabad Lake, boats at the jetty', alt: 'Attabad Lake' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Attabad Lake' })).toBeVisible();
  },
};
