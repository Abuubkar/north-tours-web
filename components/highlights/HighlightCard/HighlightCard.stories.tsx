import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '../../tour-card/sampleTours';
import { HighlightCard } from './HighlightCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Highlights/HighlightCard',
  component: HighlightCard,
  args: { highlight: sampleTour.highlights[0] },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Its title as a heading, its photo named by its alt, and one line. */
export const Photo: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: args.highlight.title })).toBeVisible();
    await expect(canvas.getByRole('img', { name: args.highlight.image.alt })).toBeVisible();
    await expect(canvas.getByText(args.highlight.text)).toBeVisible();
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

export const PhotoPhone: Story = { ...Photo, globals: { viewport: { value: 'phone' } } };

export const PhotoDesktop: Story = { ...Photo, globals: { viewport: { value: 'desktop' } } };

/** Until the photo exists, the striped placeholder names the shot. */
export const Placeholder: Story = {
  args: { highlight: sampleTour.highlights[1] },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('img', { name: args.highlight.image.alt })).toBeVisible();
  },
};

export const PlaceholderPhone: Story = { ...Placeholder, globals: { viewport: { value: 'phone' } } };

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };

export const PlaceholderDesktop: Story = { ...Placeholder, globals: { viewport: { value: 'desktop' } } };
