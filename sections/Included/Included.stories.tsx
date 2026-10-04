import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { BookingLayout } from '../BookingLayout/BookingLayout';
import { Included } from './Included';

const meta = {
  title: 'Sections/Included',
  component: Included,
  args: { copy: sampleTourCopy.included, included: sampleTour.included, notIncluded: sampleTour.notIncluded },
  decorators: [
    (Story) => (
      <BookingLayout label="Book this tour" aside={<p>Booking panel</p>}>
        <Story />
      </BookingLayout>
    ),
  ],
  parameters: { fullBleed: true },
} satisfies Meta<typeof Included>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A light section (#included): its H2 over the two lists; from 1100px it stops at the aside. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'What the price includes' });
    const section = headline.closest('section')!;
    await expect(section).toHaveAttribute('data-surface', 'light');
    const aside = canvas.getByRole('complementary');
    await expect(Math.round(section.getBoundingClientRect().right)).toBe(Math.round(aside.getBoundingClientRect().left));
    await expect(Math.round(section.getBoundingClientRect().left)).toBe(0);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 it bleeds to both edges; nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const section = canvas.getByRole('heading', { level: 2 }).closest('section')!;
    await expect(Math.round(section.getBoundingClientRect().width)).toBe(canvasElement.clientWidth);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
