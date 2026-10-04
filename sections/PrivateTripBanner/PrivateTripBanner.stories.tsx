import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleToursCopy } from '@/components/filters/sampleFilters';
import { PrivateTripBanner } from './PrivateTripBanner';

const GENERAL = `https://wa.me/?text=${encodeURIComponent('Hi, I’d like to plan a trip north.')}`;

const meta = {
  title: 'Sections/PrivateTripBanner',
  component: PrivateTripBanner,
  args: { copy: sampleToursCopy.banner, whatsappHref: GENERAL },
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
