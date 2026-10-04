import type { TourCopy } from '@/lib/content/pages';

/* The tour page's copy for stories, which can't read content files (content/pages/tour.json). */

export const sampleTourCopy: TourCopy = {
  title: '{tour}, {duration} from Lahore',
  hero: {
    backLabel: 'All tours',
  },
  facts: {
    duration: 'Duration',
    rating: 'Rating',
    from: 'from',
    fromNote: 'per person, twin sharing',
    nextDeparture: 'Next departure',
  },
  quickFacts: {
    difficulty: 'Difficulty',
    groupSize: 'Group size',
    groupSizeValue: 'Up to {count} travellers',
    departsFrom: 'Departs from',
    bestSeason: 'Best season',
    transport: 'Transport',
  },
  overview: {
    suitedTo: 'Who this trip is for',
    notSuitedTo: 'Who it may not suit',
  },
  highlights: {
    headline: 'What you’ll see along the way',
  },
  itinerary: {
    headline: 'The route, day by day',
    dayLabel: 'Day {number}',
    overnight: 'Overnight',
    meals: 'Meals',
    drive: 'Drive',
    map: {
      day: 'Day {day} of {days}',
      start: 'Start',
      description: 'Schematic map of this tour’s route',
      caption: 'Schematic · roads simplified',
    },
  },
  included: {
    headline: 'What the price includes',
    included: 'Included',
    notIncluded: 'Not included',
  },
  hotels: {
    headline: 'Where you’ll stay each night',
    description: '{description} · twin sharing',
    note: 'All rooms are twin sharing as standard. Triple and quad rooms cost less per person (see below).',
  },
  dates: {
    headline: 'Upcoming departures and prices',
    rowMeta: '{tripLength} · departs Lahore',
    priceNote: 'per person, twin',
    selectLabel: 'Select date',
    selectedLabel: 'Selected',
    waitlistLabel: 'Join waitlist',
    rooms: {
      heading: 'Room sharing',
      twin: {
        label: 'Twin sharing',
        note: 'Base price · 2 per room',
      },
      triple: {
        label: 'Triple sharing',
        note: '3 per room',
      },
      quad: {
        label: 'Quad sharing',
        note: '4 per room · good for families',
      },
      note: 'Prices are per person. Children under {childFromAge} share their parents’ room free.',
    },
  },
  booking: {
    label: 'Book this tour',
    priceNote: 'per person · twin sharing',
    dateLabel: 'Departure date',
    choosePlaceholder: 'Choose a departure',
    travellersLabel: 'Travellers',
    travellersHint: 'Adults and children {childFromAge}+',
    fewerTravellers: 'Fewer travellers',
    moreTravellers: 'More travellers',
    roomLabel: 'Room sharing',
    rooms: {
      twin: 'Twin',
      triple: 'Triple',
      quad: 'Quad',
    },
    trustLicence: 'DTS licence No. {licence}',
    trustDeparts: 'Departs from {pickupPoint}',
    totalLabel: 'Total',
    chooseDate: 'Choose a date',
    advance: 'Advance to reserve: {advance} ({advancePercent}% of total)',
    reserveLabel: 'Reserve with {advancePercent}% advance',
    soldOut: '{date} is full. Join the waitlist and we’ll message you on WhatsApp if a seat opens.',
    waitlistLabel: 'Join waitlist',
    askLabel: 'Ask on WhatsApp',
    cancelNote: 'Cancel {fullRefundDays} or more days before departure for a full refund of your advance.',
  },
  bar: {
    dateNote: 'per person · {date}',
    soldOutNote: 'per person · {date} · sold out',
    reserveLabel: 'Reserve',
    askLabel: 'Ask about {tour} on WhatsApp',
  },
  sheet: {
    subtitle: '{tripLength} · from Lahore',
  },
  cta: {
    headline: 'Hold your seats with a {advancePercent}% advance',
    lead: 'Or message us first. Most families plan this trip with us on WhatsApp.',
  },
  reviews: {
    headline: 'What travellers said after this trip',
  },
  faqs: {
    headline: 'Questions people ask before booking',
  },
  related: {
    headline: 'Other trips from Lahore',
  },
};
