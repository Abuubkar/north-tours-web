import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleReviews } from '@/components/review-card/sampleReviews';
import { sampleHome } from '../sampleHome';
import { ReviewsSection } from './ReviewsSection';

const meta = {
  title: 'Sections/ReviewsSection',
  component: ReviewsSection,
  args: { copy: sampleHome.reviews, reviews: sampleReviews, summary: { score: 4.81, count: 699 } },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof ReviewsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The headline, "★ 4.8 average · 699 reviews", then three review cards. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: sampleHome.reviews.headline })).toBeVisible();
    await expect(canvas.getByText(/average · 699 reviews$/)).toHaveTextContent('4.8 average · 699 reviews');
    await expect(canvas.getAllByRole('figure')).toHaveLength(3);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With no ratings at all, the summary is left out. */
export const NoRatings: Story = {
  args: { summary: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/average/)).toBeNull();
    await expect(canvas.getAllByRole('figure')).toHaveLength(3);
  },
};
