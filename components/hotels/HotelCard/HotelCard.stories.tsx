import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '../../tour-card/sampleTours';
import { HotelCard } from './HotelCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Hotels/HotelCard',
  component: HotelCard,
  args: { stay: sampleTour.stays[1], sharing: 'twin sharing' },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HotelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The nights, a generic title as the heading (never a hotel's name), and what it's like. */
export const Photo: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Nights 3–5 · Hunza')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Hotel in Karimabad' })).toBeVisible();
    await expect(canvas.getByText('3-star · valley view · twin sharing')).toBeVisible();
    await expect(canvas.getByRole('img', { name: args.stay.image.alt })).toBeVisible();
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

export const PhotoPhone: Story = { ...Photo, globals: { viewport: { value: 'phone' } } };

export const PhotoDesktop: Story = { ...Photo, globals: { viewport: { value: 'desktop' } } };

/** One night, and a placeholder until the town's photo exists. */
export const Placeholder: Story = {
  args: { stay: { ...sampleTour.stays[0], nights: { from: 2, to: 2 } } },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Night 2 · Chilas')).toBeVisible();
    await expect(canvas.getByRole('img', { name: args.stay.image.alt })).toBeVisible();
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };

export const PlaceholderPhone: Story = { ...Placeholder, globals: { viewport: { value: 'phone' } } };

export const PlaceholderDesktop: Story = { ...Placeholder, globals: { viewport: { value: 'desktop' } } };
