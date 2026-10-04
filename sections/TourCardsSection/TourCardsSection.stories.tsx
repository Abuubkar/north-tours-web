import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { openDeparture, sampleTour, urgentDeparture } from '@/components/tour-card/sampleTours';
import { TourCard } from '@/components/tour-card/TourCard/TourCard';
import { sampleHome } from '../sampleHome';
import { TourCardsSection } from './TourCardsSection';

const meta = {
  title: 'Sections/TourCardsSection',
  component: TourCardsSection,
  args: {
    id: 'departures',
    copy: sampleHome.departures,
    children: (
      <>
        <TourCard tour={sampleTour} departure={urgentDeparture} settings={placeholderSettings} />
        <TourCard tour={sampleTour} departure={openDeparture} settings={placeholderSettings} />
      </>
    ),
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TourCardsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The headline, the price note and "All tours", then the cards (h2 above h3). */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Upcoming group departures' })).toBeVisible();
    await expect(canvas.getByText('Prices per person, twin sharing. Every departure leaves from Lahore.')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'All tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
