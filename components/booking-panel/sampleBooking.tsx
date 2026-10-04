import type { Decorator } from '@storybook/nextjs-vite';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { departureOn, sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import type { Departure } from '@/lib/content/tours';
import { settingsTokens } from '@/lib/utils/tokens';
import { BookingProvider } from './BookingProvider/BookingProvider';
import styles from '../ui/stories.module.css';

/*
 * Sample booking data for stories, which can't read content files. Dates are in 2099 and the
 * build day is in 2020, so the browser's re-check keeps them (and drops any 2020 date).
 */

export const sampleDepartures: Departure[] = [
  departureOn('2099-05-12', '2099-05-20', 3),
  departureOn('2099-05-26', '2099-06-03', 9),
  departureOn('2099-06-09', '2099-06-17', 0),
  departureOn('2099-06-23', '2099-07-01', 14),
];

export const sampleBookingTour = {
  title: sampleTour.title,
  days: sampleTour.days,
  nights: sampleTour.nights,
  rating: sampleTour.rating,
  prices: sampleTour.prices,
};

export const sampleBookingSettings = placeholderSettings;

export const sampleBookingTokens = { ...settingsTokens(placeholderSettings), licence: placeholderSettings.legal.dtsLicence };

export const sampleBookingCopy = sampleTourCopy;

/** Wraps a story in a booking for these departures, built in 2020. */
export function withBooking(departures: Departure[] = sampleDepartures): Decorator {
  return function WithBooking(Story) {
    return (
      <BookingProvider departures={departures} builtOn="2020-01-01">
        <Story />
      </BookingProvider>
    );
  };
}

/** The aside's width, 380px. */
export const asideWidth: Decorator = (Story) => (
  <div className={styles.aside}>
    <Story />
  </div>
);

/** A WhatsApp link's message, decoded. */
export const messageOf = (link: HTMLElement) =>
  new URL(link.getAttribute('href')!).searchParams.get('text');
