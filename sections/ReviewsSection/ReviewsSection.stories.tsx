import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleReviews } from '@/components/review-card/sampleReviews';
import { monthYear } from '@/lib/utils/dates';
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

/** At 390 one column, its text lined up with the headline (the bleed holds). */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    const headline = context.canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    const quote = context.canvasElement.querySelector('blockquote')!.getBoundingClientRect();
    await expect(Math.round(quote.left)).toBe(Math.round(headline.left));
  },
};

/** One review in all: "1 review", in the singular. */
export const OneReview: Story = {
  args: { summary: { score: 5, count: 1 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/average · 1 review$/)).toBeVisible();
  },
};

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With no ratings at all, the summary is left out. */
export const NoRatings: Story = {
  args: { summary: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/average/)).toBeNull();
    await expect(canvas.getAllByRole('figure')).toHaveLength(3);
  },
};

/** Tour Detail: the standard headline size, the tour's own rating. */
export const TourDetail: Story = {
  args: { copy: { headline: 'What travellers said after this trip' }, headlineSize: 'standard', summary: { score: 4.9, count: 128 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'What travellers said after this trip' })).toBeVisible();
    await expect(canvas.getByText(/average · 128 reviews$/)).toHaveTextContent('4.9 average · 128 reviews');
  },
};

export const TourDetailOnLight: Story = { ...TourDetail, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** A tour with no reviews yet: no section at all. */
export const NoReviews: Story = {
  args: { reviews: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).toBeNull();
    await expect(canvas.queryByRole('figure')).toBeNull();
  },
};

/** Tours: no visible headline (one is read out), "★ 4.8 average · 699 reviews", then three compact cards. */
export const Compact: Story = {
  args: { variant: 'compact', copy: { headline: 'Reviews from travellers' } },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'Reviews from travellers' });
    await expect(heading.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvas.getByText(/average · 699 reviews$/)).toHaveTextContent('4.8 average · 699 reviews');
    const cards = canvas.getAllByRole('figure');
    await expect(cards).toHaveLength(3);
    for (const card of cards) {
      await expect(card.querySelector('[role="img"]')).toHaveAccessibleName(/out of 5 stars$/);
      await expect(card.querySelector('blockquote')).not.toBeEmptyDOMElement();
      await expect(card.querySelector('figcaption')!.textContent).toMatch(/, .+ · [A-Z][a-z]+ \d{4}$/);
    }
  },
};

export const CompactOnLight: Story = { ...Compact, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const CompactPhone: Story = { ...Compact, globals: { viewport: { value: 'phone' } } };

/** Destination: the standard headline and no rating summary, then the three most recent reviews, each its stars, quote, name and "tour · month". */
export const Destination: Story = {
  args: { copy: { headline: 'What travellers said about Hunza' }, headlineSize: 'standard', summary: null },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'What travellers said about Hunza' })).toBeVisible();
    await expect(canvas.queryByText(/average ·/)).toBeNull();
    const cards = canvas.getAllByRole('figure');
    await expect(cards).toHaveLength(3);
    for (const [i, { review, tourTitle }] of args.reviews.entries()) {
      const card = within(cards[i]);
      await expect(card.getByRole('img', { name: `${review.rating} out of 5 stars` })).toBeVisible();
      await expect(card.getByText(review.quote, { exact: false })).toBeVisible();
      await expect(cards[i]).toHaveTextContent(review.name);
      await expect(cards[i]).toHaveTextContent(`${tourTitle} · ${monthYear(review.month)}`);
    }
  },
};

export const DestinationOnLight: Story = { ...Destination, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const DestinationPhone: Story = { ...Destination, globals: { viewport: { value: 'phone' } } };

/** With no reviews the section is left out entirely: no headline, no grid. */
export const DestinationNoReviews: Story = {
  args: { ...Destination.args, reviews: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'What travellers said about Hunza' })).toBeNull();
    await expect(canvas.queryAllByRole('figure')).toHaveLength(0);
  },
};
