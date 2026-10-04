import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestination } from '@/components/destination-card/sampleDestinations';
import { DestinationOverview } from './DestinationOverview';

const meta = {
  title: 'Sections/DestinationOverview',
  component: DestinationOverview,
  args: { overview: sampleDestination.overview },
  parameters: { fullBleed: true },
} satisfies Meta<typeof DestinationOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The destination's headline as an H2, then its paragraphs, set to the right on a wide screen. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: sampleDestination.overview.headline });
    await expect(headline).toBeVisible();
    const paragraphs = sampleDestination.overview.paragraphs.map((p) => canvas.getByText(p));
    await expect(paragraphs).toHaveLength(2);
    const section = canvasElement.querySelector('section')!.getBoundingClientRect();
    await expect(paragraphs[0].getBoundingClientRect().left).toBeGreaterThan(section.left + section.width / 2);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** A headline past ~44 characters takes the long size: at most 56px, where the standard size reaches 66px at 1440. */
export const LongHeadline: Story = {
  args: { overview: { ...sampleDestination.overview, headline: 'Cold desert and glacial lakes at the end of the Indus road' } },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(parseFloat(getComputedStyle(canvas.getByRole('heading', { level: 2 })).fontSize)).toBeLessThanOrEqual(56);
  },
};
