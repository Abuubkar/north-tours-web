import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { departureOn as departure, sampleTour } from '../../tour-card/sampleTours';
import { sampleTourCopy } from '../../tour/sampleTourCopy';
import { HeroFacts } from './HeroFacts';

/*
 * `builtOn` is a fixed day in the past and the browser's real today is later, so the facts'
 * re-check after hydration drops anything that left in between (2020 here), as on a stale build.
 */
const upcoming = [departure('2099-05-12', '2099-05-20', 3), departure('2099-05-26', '2099-06-03', 9)];
const WHATSAPP = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

/** The value shown for a fact, found by its label. */
const factValue = (canvas: ReturnType<typeof within>, label: string) =>
  canvas.getByText(label, { selector: 'dt' }).nextElementSibling as HTMLElement;

const meta = {
  title: 'Facts/HeroFacts',
  component: HeroFacts,
  args: {
    tour: { ...sampleTour, departures: upcoming },
    builtOn: '2020-01-01',
    copy: sampleTourCopy.facts,
    whatsappHref: WHATSAPP,
  },
} satisfies Meta<typeof HeroFacts>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Duration, rating, the "from" price and the next departure with its seats, each under its label. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(factValue(canvas, 'Duration')).toHaveTextContent('9 days, 8 nights');
    await expect(within(factValue(canvas, 'Rating')).getByRole('img', { name: '4.9 out of 5, 128 reviews' })).toBeVisible();
    await expect(factValue(canvas, 'from')).toHaveTextContent('PKR 145,000per person, twin sharing');
    await expect(factValue(canvas, 'Next departure')).toHaveTextContent('12–20 May3 of 16 seats left');
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

/** Every upcoming date is full: the next one shows as sold out, as on the Homepage cards. */
export const SoldOut: Story = {
  args: { tour: { ...sampleTour, departures: [departure('2099-06-09', '2099-06-17', 0)] } },
  play: async ({ canvas }) => {
    await expect(factValue(canvas, 'Next departure')).toHaveTextContent('9–17 JunSold out · waitlist open');
  },
};

export const SoldOutOnLight: Story = { ...SoldOut, globals: { surface: 'light' } };

/** A full next date gives way to the next one with seats. */
export const NextWithSeats: Story = {
  args: { tour: { ...sampleTour, departures: [departure('2099-05-02', '2099-05-10', 0), ...upcoming] } },
  play: async ({ canvas }) => {
    await expect(factValue(canvas, 'Next departure')).toHaveTextContent('12–20 May3 of 16 seats left');
  },
};

/** No dates left: an invitation to ask on WhatsApp instead. */
export const NoneLeft: Story = {
  args: { tour: { ...sampleTour, departures: [] } },
  play: async ({ canvas }) => {
    const link = within(factValue(canvas, 'Next departure')).getByRole('link', { name: 'No upcoming dates · ask on WhatsApp' });
    await expect(link).toHaveAttribute('href', WHATSAPP);
  },
};

export const NoneLeftOnLight: Story = { ...NoneLeft, globals: { surface: 'light' } };

export const NoneLeftPhone: Story = { ...NoneLeft, globals: { viewport: { value: 'phone' } } };

/** A departure that left after the build is dropped in the browser; the following one shows. */
export const StaleBuild: Story = {
  args: { tour: { ...sampleTour, departures: [departure('2020-06-01', '2020-06-09', 5), ...upcoming] } },
  play: async ({ canvas }) => {
    await waitFor(() => expect(factValue(canvas, 'Next departure')).toHaveTextContent('12–20 May3 of 16 seats left'));
  },
};
