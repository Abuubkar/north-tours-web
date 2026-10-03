import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { RatingInline } from './RatingInline';

const meta = {
  title: 'Base/RatingInline',
  component: RatingInline,
  args: { score: 4.9, count: 128 },
} satisfies Meta<typeof RatingInline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "★ 4.9 (128)" is announced as one phrase. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('img', { name: '4.9 out of 5, 128 reviews' }),
    ).toBeInTheDocument();
  },
};

/** Whole scores still show one decimal, as in the design. */
export const WholeScore: Story = {
  args: { score: 5, count: 12 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5.0')).toBeInTheDocument();
  },
};

export const OneReview: Story = {
  args: { score: 5, count: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '5.0 out of 5, 1 review' })).toBeInTheDocument();
  },
};

export const OnLight: Story = { globals: { surface: 'light' } };
