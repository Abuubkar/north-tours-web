import type { HelpCopy } from '@/lib/content/pages';
import type { HelpCategory } from '@/lib/utils/helpAnswers';
import type { PolicyCardData } from '@/components/help/PolicyCard/PolicyCard.types';

/* Sample Help content for the Help stories, which can't read content files: the page copy and the shared FAQs, their tokens filled. */

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
  search: {
    label: 'Search questions',
    placeholder: 'Search questions, e.g. refund, altitude, children',
    clear: 'Clear search',
    results: {
      many: '{count} answers for “{query}”',
      one: '1 answer for “{query}”',
      none: 'No answers for “{query}”',
    },
  },
  empty: {
    headline: 'No answers for that yet.',
    lead: 'Ask us directly and we’ll reply on WhatsApp within 2 hours. We often add the answer here afterwards.',
    askLabel: 'Ask on WhatsApp',
    clearLabel: 'Clear search',
  },
  policiesUpdated: '2026-10-04',
  policies: {
    headline: 'Our booking policies, in plain words',
    lastUpdated: 'Last updated {date}',
    readMore: 'Read the full policy',
    hide: 'Hide the full policy',
    refundTable: {
      caption: 'How much of your advance is refunded, by how many days before departure you cancel',
      days: 'Days before departure',
      refund: 'Refund of advance',
      from: '{days} or more days',
      range: '{from}–{to} days',
      under: 'Under {days} days',
      percent: '{percent}%',
      none: 'None',
    },
    items: [
      {
        id: 'cancellation',
        title: 'Cancellation & refunds',
        summary: 'How much of your advance comes back depends on how close to departure you cancel.',
        refundTable: true,
        paragraphs: [
          'To cancel, message us on WhatsApp. The day we receive your message is the day you cancelled.',
          '{refundSchedule}',
          'Refunds are paid back the same way you paid, within {refundPaidWithinDays} days of cancelling.',
          'If we cancel a departure, you choose between a full refund and a free move to another date.',
        ],
        sample: true,
      },
      {
        id: 'changes',
        title: 'Changes to your booking',
        summary: 'Move to another date for free up to {fullRefundDays} days before departure, if it has seats.',
        paragraphs: [
          'You can move to another departure free of charge up to {fullRefundDays} days before your trip, as long as the new date has seats. Closer to departure, a change counts as a cancellation.',
          'Someone else can take your place until the balance is due, {balanceDueDays} days before departure. Send us their name and number on WhatsApp.',
        ],
        sample: true,
      },
      {
        id: 'payments',
        title: 'Payments and the advance',
        summary: 'A {advancePercent}% advance holds your seats; the balance is due {balanceDueDays} days before departure.',
        paragraphs: [
          'The advance holds your seats. We accept {paymentMethods}, and nothing else, and send the details on WhatsApp when you book.',
          'The balance is due {balanceDueDays} days before departure. We remind you on WhatsApp a few days before.',
          'You get a receipt on WhatsApp for every payment.',
        ],
        sample: true,
      },
      {
        id: 'children',
        title: 'Children and room sharing',
        summary: 'Children under {childFromAge} share their parents’ room free; older children count as travellers.',
        paragraphs: [
          'Children under {childFromAge} travel free when they share their parents’ room. From {childFromAge}, a child counts as a traveller, with a seat and a place in the room.',
          'You choose twin, triple or quad sharing when you book. Tell us your children’s ages, and we’ll plan the stops around them.',
        ],
        sample: true,
      },
      {
        id: 'weather',
        title: 'Weather and road closures',
        summary: 'If a road closes, we keep you safe first and adjust the plan.',
        paragraphs: [
          'Landslides and snow can close mountain roads. Your driver and guide decide, safety first, whether to wait, take another road or turn back, and we keep you updated on WhatsApp.',
          'Extra nights, meals and transport caused by a closure are shared at cost, with nothing added by {brand}.',
        ],
        sample: true,
      },
      {
        id: 'safety',
        title: 'Safety on the trip',
        summary: 'Checked vehicles, rested drivers, and a travel support line while you travel.',
        paragraphs: [
          'Every vehicle is checked before each departure, and drivers never drive mountain roads after dark. On long days they stop every two to three hours.',
          'On the trip, call your guide first, then our travel support line: {travelSupport}.',
        ],
        sample: true,
      },
    ],
  },
  cta: {
    headline: 'Still have a question? Ask us on WhatsApp',
    lead: 'We reply on WhatsApp within 2 hours. Phone lines are open [Mon–Sat, X am – X pm].',
    askLabel: 'Ask on WhatsApp',
    callLabel: 'Call us',
  },
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

export const samplePolicies: PolicyCardData[] = [
  {
    id: 'cancellation',
    title: 'Cancellation & refunds',
    summary: 'How much of your advance comes back depends on how close to departure you cancel.',
    refundRows: [
      {
        days: '14 or more days',
        refund: '100%',
      },
      {
        days: '7–13 days',
        refund: '50%',
      },
      {
        days: 'Under 7 days',
        refund: 'None',
      },
    ],
    paragraphs: [
      'To cancel, message us on WhatsApp. The day we receive your message is the day you cancelled.',
      'Cancel 14 or more days before departure for a full refund of your advance. Between 7 and 13 days, 50% is refunded. Within 7 days the advance is non-refundable.',
      'Refunds are paid back the same way you paid, within 7 days of cancelling.',
      'If we cancel a departure, you choose between a full refund and a free move to another date.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to your booking',
    summary: 'Move to another date for free up to 14 days before departure, if it has seats.',
    paragraphs: [
      'You can move to another departure free of charge up to 14 days before your trip, as long as the new date has seats. Closer to departure, a change counts as a cancellation.',
      'Someone else can take your place until the balance is due, 7 days before departure. Send us their name and number on WhatsApp.',
    ],
  },
  {
    id: 'payments',
    title: 'Payments and the advance',
    summary: 'A 30% advance holds your seats; the balance is due 7 days before departure.',
    paragraphs: [
      'The advance holds your seats. We accept cash or bank transfer, and nothing else, and send the details on WhatsApp when you book.',
      'The balance is due 7 days before departure. We remind you on WhatsApp a few days before.',
      'You get a receipt on WhatsApp for every payment.',
    ],
  },
  {
    id: 'children',
    title: 'Children and room sharing',
    summary: 'Children under 5 share their parents’ room free; older children count as travellers.',
    paragraphs: [
      'Children under 5 travel free when they share their parents’ room. From 5, a child counts as a traveller, with a seat and a place in the room.',
      'You choose twin, triple or quad sharing when you book. Tell us your children’s ages, and we’ll plan the stops around them.',
    ],
  },
  {
    id: 'weather',
    title: 'Weather and road closures',
    summary: 'If a road closes, we keep you safe first and adjust the plan.',
    paragraphs: [
      'Landslides and snow can close mountain roads. Your driver and guide decide, safety first, whether to wait, take another road or turn back, and we keep you updated on WhatsApp.',
      'Extra nights, meals and transport caused by a closure are shared at cost, with nothing added by [BRAND NAME].',
    ],
  },
  {
    id: 'safety',
    title: 'Safety on the trip',
    summary: 'Checked vehicles, rested drivers, and a travel support line while you travel.',
    paragraphs: [
      'Every vehicle is checked before each departure, and drivers never drive mountain roads after dark. On long days they stop every two to three hours.',
      'On the trip, call your guide first, then our travel support line: [24/7 number].',
    ],
  },
];
