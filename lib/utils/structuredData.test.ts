import { describe, expect, it } from 'vitest';
import { faqPage, jsonLdText, touristTrip, travelAgency, type TouristTripInput } from './structuredData.ts';

const placeholderSettings = {
  brand: { name: '[BRAND NAME]' },
  site: { url: '[Site URL]' },
  contact: { phone: '[+92 42 XXXX XXXX]', email: '[hello@brand.pk]', officeAddress: '[Office address], Lahore, Punjab' },
  social: { instagram: '[Instagram URL]', facebook: '[Facebook URL]', youtube: '[YouTube URL]' },
  payments: { methods: ['Cash', 'Bank transfer'] },
};

const realSettings = {
  ...placeholderSettings,
  brand: { name: 'North Tours' },
  site: { url: 'https://example.pk' },
  contact: { phone: '+92 42 3578 1234', email: 'hello@example.pk', officeAddress: '12 Mall Road, Lahore, Punjab' },
  social: { instagram: 'https://instagram.com/north', facebook: '[Facebook URL]', youtube: 'https://youtube.com/@north' },
};

const home = { description: 'Guided tours from Lahore.', image: '/images/hunza/attabad.jpg' };

describe('travelAgency', () => {
  it('leaves out placeholders, keeping the brand name as written', () => {
    expect(travelAgency(placeholderSettings, home)).toStrictEqual({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: '[BRAND NAME]',
      url: '/',
      description: 'Guided tours from Lahore.',
      image: '/images/hunza/attabad-share.jpg',
      telephone: undefined,
      email: undefined,
      address: undefined,
      sameAs: undefined,
      paymentAccepted: 'Cash, Bank transfer',
      currenciesAccepted: 'PKR',
    });
  });

  it('carries the real contact details, address as written and the real social links', () => {
    expect(travelAgency(realSettings, home)).toMatchObject({
      name: 'North Tours',
      url: 'https://example.pk/',
      image: 'https://example.pk/images/hunza/attabad-share.jpg',
      telephone: '+92 42 3578 1234',
      email: 'hello@example.pk',
      address: '12 Mall Road, Lahore, Punjab',
      sameAs: ['https://instagram.com/north', 'https://youtube.com/@north'],
    });
  });
});

const day = (n: number) => ({ title: `Day ${n}`, text: `What happens on day ${n}.`, stops: ['Lahore'], overnight: 'Hunza', meals: 'B', drive: '4 hrs' });

const trip = (change: Partial<TouristTripInput['tour']> = {}, data: Partial<TouristTripInput> = {}): TouristTripInput => ({
  tour: {
    slug: 'hunza-express',
    title: 'Hunza Express',
    summary: 'Six days from Lahore to Hunza.',
    tripTypes: ['family', 'couples'],
    itinerary: [day(1), day(2)],
    prices: { twin: 98000, triple: 92000, quad: 87000 },
    departures: [
      { start: '2027-05-01', end: '2027-05-06', seatsTotal: 16, seatsLeft: 0 },
      { start: '2027-05-12', end: '2027-05-17', seatsTotal: 16, seatsLeft: 9 },
      { start: '2027-06-02', end: '2027-06-07', seatsTotal: 16, seatsLeft: 3, prices: { twin: 110000, triple: 100000, quad: 95000 } },
      { start: '2027-07-02', end: '2027-07-07', seatsTotal: 16, seatsLeft: 0 },
    ],
    rating: { score: 4.7, count: 41, sample: true },
    sample: true,
    ...change,
  },
  image: '/images/hunza/eagles-nest.jpg',
  tripTypeLabels: { family: 'Family', couples: 'Couples', friends: 'Friends', corporate: 'Corporate' },
  reviews: [
    { name: 'Ayesha Malik', rating: 5, quote: 'Unhurried and kind.', month: '2026-05', sample: true },
    { name: 'Usman Tariq', rating: 4, quote: 'Great drivers.', month: '2026-06' },
  ],
  today: '2027-05-02',
  settings: { brand: { name: 'North Tours' }, site: { url: 'https://example.pk' } },
  ...data,
});

describe('touristTrip', () => {
  it('names the trip, its page, share image, trip types as labelled and the company', () => {
    expect(touristTrip(trip())).toMatchObject({
      '@type': 'TouristTrip',
      name: 'Hunza Express',
      description: 'Six days from Lahore to Hunza.',
      url: 'https://example.pk/tours/hunza-express',
      image: 'https://example.pk/images/hunza/eagles-nest-share.jpg',
      touristType: ['Family', 'Couples'],
      provider: { '@type': 'TravelAgency', name: 'North Tours', url: 'https://example.pk/' },
    });
  });

  it('lists the itinerary’s days in order', () => {
    expect(touristTrip(trip()).itinerary).toEqual({
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Day 1', description: 'What happens on day 1.' },
        { '@type': 'ListItem', position: 2, name: 'Day 2', description: 'What happens on day 2.' },
      ],
    });
  });

  it('offers each upcoming departure in PKR, valid until it leaves, at its own prices, with availability from seats', () => {
    expect(touristTrip(trip()).offers).toEqual([
      {
        '@type': 'Offer',
        price: 98000,
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock',
        validThrough: '2027-05-12',
        url: 'https://example.pk/tours/hunza-express#dates',
        itemOffered: { '@type': 'Trip', name: 'Hunza Express', departureTime: '2027-05-12', arrivalTime: '2027-05-17' },
      },
      expect.objectContaining({ price: 110000, availability: 'https://schema.org/LimitedAvailability', validThrough: '2027-06-02' }),
      expect.objectContaining({ price: 98000, availability: 'https://schema.org/SoldOut', validThrough: '2027-07-02' }),
    ]);
  });

  it('has no offers once every departure has left', () => {
    expect(touristTrip(trip({}, { today: '2027-08-01' })).offers).toBeUndefined();
  });

  it('marks up the rating only when neither the tour nor its rating is sample', () => {
    expect(touristTrip(trip()).aggregateRating).toBeUndefined();
    expect(touristTrip(trip({ sample: undefined })).aggregateRating).toBeUndefined();
    expect(touristTrip(trip({ rating: { score: 4.7, count: 41 } })).aggregateRating).toBeUndefined();
    expect(touristTrip(trip({ sample: undefined, rating: { score: 4.7, count: 41 } })).aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.7,
      reviewCount: 41,
      bestRating: 5,
    });
  });

  it('marks up only the reviews that aren’t sample, and none while all are', () => {
    expect(touristTrip(trip()).review).toEqual([
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Usman Tariq' },
        reviewRating: { '@type': 'Rating', ratingValue: 4, bestRating: 5 },
        reviewBody: 'Great drivers.',
        datePublished: '2026-06',
      },
    ]);
    const allSample = trip({}, { reviews: [{ name: 'Ayesha Malik', rating: 5, quote: 'Kind.', month: '2026-05', sample: true }] });
    expect(touristTrip(allSample).review).toBeUndefined();
  });

  it('uses root-relative URLs while the site URL is a placeholder', () => {
    const data = trip({}, { settings: { brand: { name: '[BRAND NAME]' }, site: { url: '[Site URL]' } } });
    expect(touristTrip(data)).toMatchObject({ url: '/tours/hunza-express', provider: { name: '[BRAND NAME]', url: '/' } });
  });
});

describe('faqPage', () => {
  it('lists the questions in page order, each with its answer as shown', () => {
    const questions = [
      { question: 'How do I book?', answer: 'Pay a 30% advance.' },
      { question: 'Can I bring children?', answer: 'Yes, from age 5.' },
    ];
    expect(faqPage(questions)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I book?', acceptedAnswer: { '@type': 'Answer', text: 'Pay a 30% advance.' } },
        { '@type': 'Question', name: 'Can I bring children?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, from age 5.' } },
      ],
    });
  });
});

describe('jsonLdText', () => {
  it('escapes < so a value can’t close the script, and parses back to the data', () => {
    const data = { name: 'A </script><script>alert(1)</script> trip' };
    const text = jsonLdText(data);
    expect(text).not.toContain('</script>');
    expect(JSON.parse(text)).toEqual(data);
  });
});
