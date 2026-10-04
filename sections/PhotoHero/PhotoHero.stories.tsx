import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { HeroFacts } from '@/components/facts/HeroFacts/HeroFacts';
import { sampleTour } from '@/components/tour-card/sampleTours';
import type { Departure } from '@/lib/content/tours';
import { sampleTourCopy } from '../sampleTourCopy';
import { PhotoHero } from './PhotoHero';
import styles from '../../components/ui/stories.module.css';

const departure = (start: string, end: string, seatsLeft: number): Departure => ({ start, end, seatsTotal: 16, seatsLeft });
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
