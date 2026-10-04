import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { BookingLayout } from '../BookingLayout/BookingLayout';
import { TripOverview } from './TripOverview';

const meta = {
  title: 'Sections/TripOverview',
  component: TripOverview,
  args: { overview: sampleTour.overview, copy: sampleTourCopy.overview },
  decorators: [
    (Story) => (
      <BookingLayout label="Book this tour" aside={<p>Booking panel</p>}>
        <Story />
      </BookingLayout>
    ),
  ],
  parameters: { fullBleed: true },
} satisfies Meta<typeof TripOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The tour's headline (H2), its paragraphs, then who it suits (H3s). */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: sampleTour.overview.headline })).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    await expect(canvasElement.querySelector('section')).toHaveAttribute('id', 'overview');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};
