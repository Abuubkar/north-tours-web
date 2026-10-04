import type { HelpCopy } from '@/lib/content/pages';
import type { HelpCategory } from '@/lib/utils/helpAnswers';

/* Sample Help content for the Help stories, which can't read content files: the shared FAQs, filled. */

export const sampleHelpCopy: HelpCopy = {
  title: 'Help and FAQs',
  description:
    'Answers about booking, the advance and payments, refunds, children, altitude and safety on our tours from Lahore, plus our booking policies in plain words.',
  header: {
    headline: 'Help with booking, payments and the trip',
  },
  categories: {
    label: 'Help categories',
    count: {
      one: '{count} answer',
      other: '{count} answers',
    },
  },
  linkToAnswer: 'Link to this answer · {path}',
};

export const sampleHelpCategories: HelpCategory[] = [
  {
    id: 'booking',
    title: 'Booking & payment',
    questions: [
      {
        id: 'how-to-book',
        question: 'How do I book a trip?',
        answer:
          'Choose a departure on its tour page and press Reserve, or message us on WhatsApp. Your seats are confirmed once the 30% advance is paid.',
      },
      {
        id: 'advance',
        question: 'How do payment and the advance work?',
        answer:
          'Pay a 30% advance to confirm your seats, by cash or bank transfer. The balance is due 7 days before departure. You get a receipt on WhatsApp for every payment.',
      },
      {
        id: 'payment-methods',
        question: 'How can I pay?',
        answer: 'By cash or bank transfer, and nothing else. We send the details on WhatsApp when you book.',
      },
      {
        id: 'balance',
        question: 'When is the balance due?',
        answer: '7 days before departure. We remind you on WhatsApp a few days before it’s due.',
      },
    ],
  },
  {
    id: 'cancellations',
    title: 'Cancellations & changes',
    questions: [
      {
        id: 'refunds',
        question: 'What is the cancellation and refund policy?',
        answer:
          'Cancel 14 or more days before departure for a full refund of your advance. Between 7 and 13 days, 50% is refunded. Within 7 days the advance is non-refundable. If we cancel a departure, you get a full refund or a free move to another date.',
      },
      {
        id: 'change-dates',
        question: 'Can I change my dates?',
        answer:
          'Yes, free of charge up to 14 days before departure, if the new date has seats. Closer to departure, a change counts as a cancellation.',
      },
      {
        id: 'we-cancel',
        question: 'What happens if you cancel a departure?',
        answer:
          'You get a full refund, or a free move to another date. We only cancel for safety, road closures or too few travellers, and tell you on WhatsApp as soon as we know.',
      },
      {
        id: 'name-change',
        question: 'Can someone else take my place?',
        answer: 'Yes, until the balance is due, 7 days before departure. Send us their name and number on WhatsApp.',
      },
    ],
  },
  {
    id: 'on-trip',
    title: 'On the trip',
    questions: [
      {
        id: 'altitude',
        question: 'Will the altitude affect me?',
        answer:
          'Most overnight stops are below about 2,500 m. Drink plenty of water, take the first day slowly, and tell us about any heart or breathing condition before you book.',
      },
      {
        id: 'packing',
        question: 'What should I pack?',
        answer:
          'Layers, a warm jacket, comfortable shoes, sunglasses, sun cream and any medicines you take. We send a full packing list on WhatsApp after you book.',
      },
      {
        id: 'roads',
        question: 'What if the road closes or the weather turns?',
        answer:
          'Landslides can close mountain roads, mostly in spring and the monsoon. Your driver adapts the plan and we keep you updated on WhatsApp. Extra nights are shared at cost, with nothing added.',
      },
      {
        id: 'signal',
        question: 'Will my phone work?',
        answer:
          'Mobile networks work in most towns. Signal is patchy or absent in upper Hunza, Deosai and Fairy Meadows, and your guide carries a way to reach our office from there.',
      },
      {
        id: 'food',
        question: 'What is the food like?',
        answer: 'Breakfast and dinner are included, mostly Pakistani and local dishes. Tell us about allergies or diets when you book.',
      },
    ],
  },
  {
    id: 'families',
    title: 'Families & children',
    questions: [
      {
        id: 'children',
        question: 'Can we travel with children?',
        answer:
          'Yes. Children aged 5 and over count as travellers; younger children share their parents’ room free. Tell us their ages when you book and we’ll plan the stops around them.',
      },
      {
        id: 'child-pricing',
        question: 'Do children pay less?',
        answer:
          'Children under 5 travel free when they share their parents’ room. From 5, a child counts as a traveller, with a seat and a place in the room.',
      },
      {
        id: 'elderly',
        question: 'Can we travel with elderly parents?',
        answer: 'Yes. Tell us about mobility and health, and we plan shorter walks, more stops and ground-floor rooms where we can.',
      },
      {
        id: 'long-drives',
        question: 'Are the long drives hard on children?',
        answer: 'Some days are long. We stop every two to three hours and plan around meals, rest and bathrooms.',
      },
    ],
  },
  {
    id: 'private',
    title: 'Private & corporate trips',
    questions: [
      {
        id: 'quotes',
        question: 'How do private trip quotes work?',
        answer:
          'Tell us your dates, group and style in the trip planner or on WhatsApp. We reply within 2 hours with a day-by-day plan and a price per person.',
      },
      {
        id: 'invoices',
        question: 'Can you invoice our company?',
        answer: 'Yes. We issue invoices in your company’s name, with our registration details.',
      },
      {
        id: 'group-size',
        question: 'How large can a corporate group be?',
        answer: 'From 10 to 60 people, with as many vehicles and guides as the group needs.',
      },
      {
        id: 'own-dates',
        question: 'Can we choose our own dates?',
        answer: 'Yes. Private trips run on your dates, as long as the roads and the weather allow.',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    questions: [
      {
        id: 'driver-rest',
        question: 'How long do drivers drive each day?',
        answer: 'No more than ten hours, with a break every two to three hours, and never on mountain roads after dark.',
      },
      {
        id: 'first-aid',
        question: 'What about first aid?',
        answer: 'Every vehicle carries a first-aid kit, and at least one guide on each trip is trained in first aid.',
      },
      {
        id: 'road-closed',
        question: 'What happens if the road closes mid-trip?',
        answer:
          'We stop somewhere safe, arrange rooms and carry on when the road reopens. Extra nights, meals and transport are shared at cost, with nothing added.',
      },
      {
        id: 'emergency',
        question: 'Who do I call in an emergency on a trip?',
        answer: 'Your guide first, then our travel support line, [24/7 number].',
      },
    ],
  },
];
