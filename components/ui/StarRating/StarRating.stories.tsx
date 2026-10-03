import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { StarRating } from './StarRating';

const meta = {
  title: 'Base/StarRating',
  component: StarRating,
  args: { rating: 5, size: 15 },
  argTypes: {
    rating: { control: 'inline-radio', options: [1, 2, 3, 4, 5] },
    size: { control: 'inline-radio', options: [15, 13] },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Read as one phrase, not as five separate images. */
export const FiveStars: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '5 out of 5 stars' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('img')).toHaveLength(1);
  },
};

export const FourStars: Story = {
  args: { rating: 4 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '4 out of 5 stars' })).toBeInTheDocument();
  },
};

export const Compact: Story = { args: { size: 13 } };
