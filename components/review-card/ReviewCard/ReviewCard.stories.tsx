import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleReviews } from '../sampleReviews';
import { ReviewCard } from './ReviewCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Review card/ReviewCard',
  component: ReviewCard,
  args: sampleReviews[0],
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Stars, the quote, then the name and place, and "tour · month". */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '5 out of 5 stars' })).toBeVisible();
    await expect(canvas.getByRole('figure')).toHaveTextContent(/Three nights in Hunza was the right call/);
    await expect(canvas.getByText('Ayesha Malik & family, Lahore')).toBeVisible();
    await expect(canvas.getByText('Hunza & Skardu Grand · May 2026')).toBeVisible();
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

/** Four stars: the fifth is drawn in the hairline colour. */
export const FourStars: Story = {
  args: sampleReviews[1],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '4 out of 5 stars' })).toBeVisible();
  },
};

/** Compact (Tours): 13px stars, the smaller quote, caption and padding. */
export const Compact: Story = {
  args: { variant: 'compact' },
  play: async ({ canvas }) => {
    const stars = canvas.getByRole('img', { name: '5 out of 5 stars' });
    await expect(stars.querySelector('svg')!.getAttribute('width')).toBe('13');
    await expect(getComputedStyle(canvas.getByText(/Three nights in Hunza/)).fontSize).toBe('17px');
    await expect(canvas.getByText('Ayesha Malik & family, Lahore')).toBeVisible();
    await expect(canvas.getByText('Hunza & Skardu Grand · May 2026')).toBeVisible();
  },
};

export const CompactOnLight: Story = { ...Compact, globals: { surface: 'light' } };

export const CompactPhone: Story = { ...Compact, globals: { viewport: { value: 'phone' } } };
