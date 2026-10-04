import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination } from '@/components/destination-card/sampleDestinations';
import { DestinationFacts } from '@/components/facts/DestinationFacts/DestinationFacts';
import { HeroFacts } from '@/components/facts/HeroFacts/HeroFacts';
import { departureOn as departure, sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import type { Departure } from '@/lib/content/tours';
import { PhotoHero } from './PhotoHero';
import styles from '../../components/ui/stories.module.css';
const upcoming = [departure('2099-05-12', '2099-05-20', 3), departure('2099-05-26', '2099-06-03', 9)];

/** The hero with a tour's facts, as the tour page renders it. `builtOn` is in the past (see HeroFacts). */
const facts = (departures: Departure[]) => (
  <HeroFacts
    tour={{ ...sampleTour, departures }}
    builtOn="2020-01-01"
    copy={sampleTourCopy.facts}
    whatsappHref="https://wa.me/?text=Hi"
  />
);

const meta = {
  title: 'Sections/PhotoHero',
  component: PhotoHero,
  args: {
    image: sampleTour.image,
    back: { href: '/tours', label: 'All tours' },
    kicker: 'Lahore → Hunza → Skardu',
    title: 'Hunza & Skardu Grand',
    children: facts(upcoming),
  },
  parameters: { fullBleed: true },
  decorators: [
    (Story) => (
      <div className={styles.underHeader}>
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PhotoHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The title is the page's only <h1>; the back link goes to all tours; the photo loads first. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Hunza & Skardu Grand' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: 'All tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByText('Lahore → Hunza → Skardu')).toBeVisible();
    for (const label of ['Duration', 'Rating', 'from', 'Next departure']) {
      await expect(canvas.getByText(label, { selector: 'dt' }).nextElementSibling).not.toBeEmptyDOMElement();
    }
    const photo = canvas.getByRole('img', { name: sampleTour.image.alt });
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    await expect(photo).toHaveAttribute('loading', 'eager');
  },
};

/** The hero sits on its photo, so it stays dark on a light page. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the title wraps and the facts take two columns; nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** Until the tour has a photo, the striped placeholder names the shot. */
export const Placeholder: Story = {
  args: { image: { placeholder: 'Attabad Lake at golden hour, boats at the jetty', alt: 'Attabad Lake' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Attabad Lake' })).toBeVisible();
  },
};

export const PlaceholderPhone: Story = { ...Placeholder, globals: { viewport: { value: 'phone' } } };

/** Every date full: the next departure shows as sold out. */
export const SoldOut: Story = {
  args: { children: facts([departure('2099-06-09', '2099-06-17', 0)]) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sold out · waitlist open')).toBeVisible();
  },
};

export const SoldOutPhone: Story = { ...SoldOut, globals: { viewport: { value: 'phone' } } };

/** No dates left: WhatsApp instead. */
export const NoneLeft: Story = {
  args: { children: facts([]) },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'No upcoming dates · ask on WhatsApp' })).toBeVisible();
  },
};

export const NoneLeftPhone: Story = { ...NoneLeft, globals: { viewport: { value: 'phone' } } };

/** With a fixed build day in the past, a departure that has left since gives way to the next. */
export const StaleBuild: Story = {
  args: { children: facts([departure('2020-06-01', '2020-06-09', 5), ...upcoming]) },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('Next departure').nextElementSibling).toHaveTextContent(/^12–20 May/));
  },
};

/** Nothing on the page scrolls sideways. */
async function noSideScroll(canvasElement: HTMLElement) {
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
}

/** A destination's facts under its hero. */
const destinationFacts = (tourCount: number) => (
  <DestinationFacts destination={sampleDestination} tourCount={tourCount} copy={sampleDestinationCopy.facts} />
);

/** The name sits on one line, wholly inside the hero: its size follows its length. */
async function nameFitsOnOneLine(canvasElement: HTMLElement) {
  const name = canvasElement.querySelector('h1')!;
  const text = document.createRange();
  text.selectNodeContents(name);
  await expect(text.getClientRects()).toHaveLength(1);
  await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth);
  await expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().right);
}

/** Destination: the name at display size is the only <h1>; "All destinations" goes to the Homepage's list; the facts follow the lead. */
export const Destination: Story = {
  args: {
    variant: 'destination',
    image: sampleDestination.image,
    back: { href: '/#destinations', label: 'All destinations' },
    kicker: sampleDestination.region,
    title: sampleDestination.name,
    lead: sampleDestination.lead,
    children: destinationFacts(2),
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Hunza' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await nameFitsOnOneLine(canvasElement);
    await expect(canvas.getByRole('link', { name: 'All destinations' })).toHaveAttribute('href', '/#destinations');
    await expect(canvas.getByText('Gilgit-Baltistan')).toBeVisible();
    await expect(canvas.getByText(sampleDestination.lead)).toBeVisible();
    for (const [label, value] of [['Best season', 'April – October'], ['Altitude', '2,438 m'], ['From Lahore', '3 days by road'], ['Tours', '2']]) {
      await expect(canvas.getByText(label, { selector: 'dt' }).nextElementSibling).toHaveTextContent(value);
    }
    const photo = canvas.getByRole('img', { name: sampleDestination.image.alt });
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
  },
};

export const DestinationOnLight: Story = { ...Destination, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const DestinationPhone: Story = {
  ...Destination,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Destination.play!(context);
    await noSideScroll(context.canvasElement);
  },
};

/** A long name ("Fairy Meadows") shrinks to stay on one line. */
export const DestinationLongName: Story = {
  args: { ...Destination.args, title: 'Fairy Meadows' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Fairy Meadows' })).toBeVisible();
    await nameFitsOnOneLine(canvasElement);
  },
};

export const DestinationLongNamePhone: Story = {
  ...DestinationLongName,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await DestinationLongName.play!(context);
    await noSideScroll(context.canvasElement);
  },
};

/** A short name ("Swat") is capped at the display size. */
export const DestinationShortName: Story = {
  args: { ...Destination.args, title: 'Swat', kicker: 'Khyber Pakhtunkhwa' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Swat' })).toBeVisible();
    await nameFitsOnOneLine(canvasElement);
  },
};

export const DestinationShortNamePhone: Story = { ...DestinationShortName, globals: { viewport: { value: 'phone' } } };

/** Until the destination has a photo, the striped placeholder names the shot. */
export const DestinationPlaceholder: Story = {
  args: { ...Destination.args, image: { placeholder: 'Karimabad terraces with Rakaposhi behind', alt: 'Karimabad and Rakaposhi' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Karimabad and Rakaposhi' })).toBeVisible();
  },
};

export const DestinationPlaceholderPhone: Story = { ...DestinationPlaceholder, globals: { viewport: { value: 'phone' } } };

/** No tour visits yet: no Tours fact. */
export const DestinationNoTours: Story = {
  args: { ...Destination.args, children: destinationFacts(0) },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Tours', { selector: 'dt' })).toBeNull();
    await expect(canvas.getByText('From Lahore', { selector: 'dt' })).toBeVisible();
  },
};

export const DestinationNoToursPhone: Story = { ...DestinationNoTours, globals: { viewport: { value: 'phone' } } };
