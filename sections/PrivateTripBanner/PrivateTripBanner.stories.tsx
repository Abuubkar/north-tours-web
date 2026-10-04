import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleToursCopy } from '@/components/filters/sampleFilters';
import { PrivateTripBanner } from './PrivateTripBanner';

const GENERAL = `https://wa.me/?text=${encodeURIComponent('Hi, I’d like to plan a trip north.')}`;

const meta = {
  title: 'Sections/PrivateTripBanner',
  component: PrivateTripBanner,
  args: { copy: sampleToursCopy.banner, planHref: '/plan', whatsappHref: GENERAL },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PrivateTripBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The photo, the <h2>, the lead, then the planner and WhatsApp with the general message. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Plan a private trip for your family or team' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: sampleToursCopy.banner.image.alt })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan');
    await expect(canvas.getByRole('link', { name: 'Ask on WhatsApp' })).toHaveAttribute('href', GENERAL);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390 the photo sits above the text, and nothing scrolls sideways. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

const HUNZA = `https://wa.me/?text=${encodeURIComponent('Hi, I’d like to plan a private trip to Hunza.')}`;

/** Destination: its own section; the planner opens with Hunza chosen, and WhatsApp asks about Hunza. */
export const Destination: Story = {
  args: {
    variant: 'section',
    copy: { ...sampleToursCopy.banner, headline: 'Hunza, on your own dates' },
    planHref: '/plan?dest=hunza',
    whatsappHref: HUNZA,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Hunza, on your own dates' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan?dest=hunza');
    const ask = canvas.getByRole('link', { name: 'Ask on WhatsApp' });
    await expect(decodeURIComponent(new URL(ask.getAttribute('href')!).searchParams.get('text')!)).toBe('Hi, I’d like to plan a private trip to Hunza.');
  },
};

export const DestinationOnLight: Story = { ...Destination, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const DestinationPhone: Story = {
  ...Destination,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Destination.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};
