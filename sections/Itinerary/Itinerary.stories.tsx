import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { BookingLayout } from '../BookingLayout/BookingLayout';
import { Itinerary } from './Itinerary';

const meta = {
  title: 'Sections/Itinerary',
  component: Itinerary,
  args: { copy: sampleTourCopy.itinerary, tour: sampleTour },
  decorators: [
    (Story) => (
      <BookingLayout label="Book this tour" aside={<p>Booking panel</p>}>
        <Story />
      </BookingLayout>
    ),
  ],
  parameters: { fullBleed: true },
} satisfies Meta<typeof Itinerary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2 over the days, in the main column beside the booking aside; the side map from 1280px. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'The route, day by day' })).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(sampleTour.itinerary.length);
    await expect(canvas.getByRole('img', { name: 'Schematic map of this tour’s route' })).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('img')).toBeNull();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
