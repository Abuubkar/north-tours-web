import type { Decorator } from '@storybook/nextjs-vite';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import type { PlannerPage } from '@/lib/content/plannerPage';
import { PlannerProvider } from './PlannerProvider/PlannerProvider';

/* Sample Trip Planner copy and destinations for stories, which can't read content files (content/pages/planner.json). */

export const samplePlannerCopy: PlannerPage['copy'] = {
  title: 'Plan a private trip from Lahore',
  description: 'Tell us where and when, who’s coming and what matters to you.',
  header: {
    headline: 'Your dates, your group',
    lead: 'Tell us what you have in mind. We’ll plan it and reply on WhatsApp, usually within 2 hours.',
    slim: 'Planning your private trip',
  },
  progress: { step: 'Step {step} of 3 · {title}', review: 'Review · Check and send' },
  steps: { whereWhen: 'Where and when', whosComing: 'Who’s coming', details: 'Your details' },
  nav: { back: 'Back', next: 'Next: {title}' },
  whereWhen: {
    destinations: { label: 'Destinations', hint: 'Required · choose one or more', unsure: 'Not sure, suggest something' },
    dates: {
      label: 'Dates',
      hint: 'Required',
      modeLabel: 'Date type',
      modes: { exact: 'Exact dates', flexible: 'Flexible' },
      from: 'From',
      to: 'To',
      month: 'Month',
      roughly: 'Roughly',
      days: 'days',
      daysLabel: 'Roughly how many days',
      fewerDays: 'Fewer days',
      moreDays: 'More days',
    },
    length: {
      label: 'Trip length',
      hint: 'Optional',
      autoHint: 'Optional · filled from your flexible dates',
      options: { '2-4': '2–4 days', '5-7': '5–7 days', '8-10': '8–10 days', '10plus': '10+ days' },
    },
  },
  whosComing: {
    group: {
      label: 'Group size',
      hint: 'Required',
      adults: { label: 'Adults', hint: '18 and over', fewer: 'Fewer adults', more: 'More adults' },
      children: { label: 'Children', hint: 'Under 18', fewer: 'Fewer children', more: 'More children' },
    },
    ages: { label: 'Children’s ages (helps us plan rooms and stops)', child: 'Child {count}', placeholder: 'Age', underTwo: 'Under 2' },
    groupType: { label: 'Group type', hint: 'Optional', options: { family: 'Family', couple: 'Couple', friends: 'Friends', corporate: 'Corporate team' } },
    hotels: { label: 'Hotels', hint: 'Optional', options: { comfortable: 'Comfortable', upgraded: 'Upgraded', best: 'Best available' } },
    transport: { label: 'Transport', hint: 'Optional', options: { car: 'Car', coaster: 'Coaster', suggest: 'Let us suggest' } },
    departingFrom: {
      label: 'Departing from',
      hint: 'Lahore by default',
      options: { lahore: 'Lahore', islamabad: 'Islamabad', other: 'Other city' },
      otherCity: 'Other city',
      otherCityPlaceholder: 'Which city?',
    },
    budget: {
      label: 'Budget per person',
      hint: 'Optional',
      options: { 'under-50k': 'Under PKR 50k', '50-100k': 'PKR 50–100k', '100k-plus': 'PKR 100k+', 'not-sure': 'Not sure yet' },
    },
  },
  errors: {
    destinations: 'Choose at least one destination, or “Not sure, suggest something”.',
    month: 'Pick a month, or switch to exact dates.',
    dates: 'Add a start and an end date.',
    pastDate: 'That date has passed. Choose today or later.',
    endBeforeStart: 'The end date is before the start date.',
    ages: 'Add an age for each child.',
  },
};

/** The six destinations in the loader's order (by slug). */
export const samplePlannerDestinations: PlannerPage['destinations'] = [
  { slug: 'fairy-meadows', name: 'Fairy Meadows', image: samplePhoto },
  { slug: 'hunza', name: 'Hunza', image: samplePhoto },
  { slug: 'murree', name: 'Murree', image: samplePhoto },
  { slug: 'naran-kaghan', name: 'Naran-Kaghan', image: samplePhoto },
  { slug: 'skardu', name: 'Skardu', image: samplePhoto },
  { slug: 'swat', name: 'Swat', image: samplePhoto },
];

/** A build date long past, so the browser's own date (today) is what the planner uses. */
export const sampleBuiltOn = '2026-01-01';

/** Puts the story inside a planner, as the page does. */
export const withPlanner: Decorator = (Story) => (
  <PlannerProvider destinations={samplePlannerDestinations.map((d) => d.slug)} builtOn={sampleBuiltOn} messages={samplePlannerCopy.errors}>
    <Story />
  </PlannerProvider>
);
