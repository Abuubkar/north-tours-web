import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { emulateReducedMotion } from '../../.storybook/reducedMotion';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { Highlights } from './Highlights';

const meta = {
  title: 'Sections/Highlights',
  component: Highlights,
  args: { headline: 'What you’ll see along the way', highlights: sampleTour.highlights },
  beforeEach: emulateReducedMotion,
  parameters: { fullBleed: true },
} satisfies Meta<typeof Highlights>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2, then each highlight with its title as an H3. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'What you’ll see along the way' })).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };
