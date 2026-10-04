import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination, sampleMurree } from '@/components/destination-card/sampleDestinations';
import { SeasonCalendarSection } from './SeasonCalendarSection';

const meta = {
  title: 'Sections/SeasonCalendarSection',
  component: SeasonCalendarSection,
  args: { destination: sampleDestination, copy: sampleDestinationCopy.calendar },
  parameters: { fullBleed: true },
} satisfies Meta<typeof SeasonCalendarSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2, the calendar's twelve months, then the four seasons as H3s under it. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'The best months to visit' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('ol > li')).toHaveLength(12);
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(4);
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

export const Murree: Story = { ...Desktop, args: { destination: sampleMurree } };
