import type { Settings } from '@/lib/content/settings';

/*
 * Sample settings for the layout stories, which can't read content files. The placeholder set has
 * every contact value a `[placeholder]` (ADR-0010), as content/settings.json had until the owner
 * supplied the office's address and phone; the real set shows links once real values arrive.
 */

export const placeholderSettings: Settings = {
  brand: { name: '[BRAND NAME]' },
  site: { url: '[Site URL]' },
  contact: {
    whatsapp: '[+92 3XX XXX XXXX]',
    phone: '[+92 42 XXXX XXXX]',
    email: '[hello@brand.pk]',
    officeAddress: '[Office address], Lahore, Punjab',
    officeMapQuery: '[Office address], Lahore, Punjab',
    officeHours: '[Mon–Sat, X am – X pm]',
    travelSupport: '[24/7 number]',
  },
  booking: { advancePercent: 30, replyTime: 'within 2 hours', pickupPoint: '[Pickup point], Lahore' },
  policies: {
    refundSchedule: [
      { daysBefore: 14, refundPercent: 100 },
      { daysBefore: 7, refundPercent: 50 },
      { daysBefore: 0, refundPercent: 0 },
    ],
    balanceDueDays: 7,
    refundPaidWithinDays: 7,
    childFromAge: 5,
  },
  payments: { methods: ['Cash', 'Bank transfer'] },
  legal: { dtsLicence: '[DTS licence number]', companyRegistration: '[SECP or NTN number]' },
  social: { instagram: '[Instagram URL]', facebook: '[Facebook URL]', youtube: '[YouTube URL]' },
  trust: {
    operatingSince: 2014,
    tripsCompleted: '1,200+',
    licence: { label: 'DTS licence', value: 'No. {licence}', note: 'Department of Tourist Services, Punjab' },
    operating: { label: 'Operating', value: '{years} years', note: 'From our office in Lahore' },
    trips: { label: 'Trips completed', note: 'Group and private' },
    departs: { label: 'Departs from' },
    payments: { label: 'We accept' },
  },
  visitOffice: {
    headline: 'Plan your trip over chai at our Lahore office',
    rows: { office: 'Office', open: 'Open', mobile: 'Mobile' },
    directionsLabel: 'Get directions',
    whatsappLabel: 'WhatsApp first',
    mapTitle: 'Map of our office in DHA Phase 8, Lahore',
    mapLinkLabel: 'Open in Google Maps',
  },
  maps: { surveyOfPakistanVetted: false },
  whatsapp: {
    generalMessage: 'Hi, I’d like to plan a trip north.',
    footerIntro:
      'Most of our trips are planned on WhatsApp. Send your dates and group size and we’ll take it from there.',
    tourMessage: 'Hi, I’m interested in {tour} on {date}.',
    waitlistMessage: 'Hi, please add me to the waitlist for {tour} on {date} in case a seat opens up.',
    guideShareMessage: 'Meet {name}, our {role}: {url}',
    destinationMessage: 'Hi, I’d like to plan a private trip to {destination}.',
    reserveMessage:
      'Hi, I’d like to reserve {travellers} on {tour}, {dates}, {room} sharing. Total {total}; I’ll pay the {advancePercent}% advance of {advance}.',
    planner: {
      greeting: 'Assalam o Alaikum! I’d like to plan a private trip.',
      destinations: '• Destinations: {destinations}',
      dates: '• Dates: {dates}',
      group: '• Group: {group}',
      stay: '• Hotels: {hotels} · Transport: {transport}',
      departingFrom: '• Departing from: {departingFrom}',
      budget: '• Budget per person: {budget}',
      bestTime: '• Best time to reach me: {bestTime}',
      notes: '• Notes: {notes}',
      name: 'Name: {name}',
      phone: 'WhatsApp: {phone}',
      callBack: 'Please call me back on {phone}, best time {bestTime}.',
      any: 'Any',
      anyTime: 'any time',
    },
  },
};

/** Real-looking contact values, to show how links behave once placeholders are replaced. */
export const realSettings: Settings = {
  ...placeholderSettings,
  contact: {
    ...placeholderSettings.contact,
    whatsapp: '+92 300 1234567',
    phone: '+92 42 3578 1234',
    email: 'hello@example.pk',
    officeAddress: '12 Main Boulevard, Gulberg, Lahore',
    officeMapQuery: '12 Main Boulevard, Gulberg, Lahore',
    officeHours: 'Mon–Sat, 10 am – 7 pm',
  },
  site: { url: 'https://example.pk' },
  legal: { ...placeholderSettings.legal, dtsLicence: '1234' },
  social: {
    instagram: 'https://instagram.com/example',
    facebook: 'https://facebook.com/example',
    youtube: 'https://youtube.com/@example',
  },
};

/**
 * Today's contact settings: the office's address and phone from the owner's Google Maps listing
 * (2026-10-05), every other contact value still a placeholder.
 */
export const listingSettings: Settings = {
  ...placeholderSettings,
  contact: {
    ...placeholderSettings.contact,
    phone: '+92 42 3725 2511',
    officeAddress: '3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000',
    officeMapQuery: 'Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000',
  },
};
