import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Tag } from './Tag';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/Tag',
  component: Tag,
  args: { variant: 'urgent', children: 'Only 3 seats left' },
  argTypes: { variant: { control: 'inline-radio', options: ['urgent', 'soldout', 'category'] } },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Urgent: Story = {};

export const SoldOut: Story = { args: { variant: 'soldout', children: 'Sold out' } };

export const Category: Story = { args: { variant: 'category', children: 'Heritage' } };

/** Status tags sit on photos and stay dark even inside a light section. */
export const OnPhoto: Story = {
  render: () => (
    <div className={`${styles.row} ${styles.photo}`}>
      <Tag variant="urgent">Only 3 seats left</Tag>
      <Tag variant="soldout">Sold out</Tag>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const text of ['Only 3 seats left', 'Sold out']) {
      const tag = canvas.getByText(text);
      await expect(tag).toHaveAttribute('data-surface', 'dark');
      await expect(parseFloat(getComputedStyle(tag).fontSize)).toBeGreaterThanOrEqual(13);
    }
  },
};

export const Categories: Story = {
  render: () => (
    <div className={styles.row}>
      {['Heritage', 'Viewpoint', 'Lake', 'Adventure'].map((name) => (
        <Tag key={name} variant="category">
          {name}
        </Tag>
      ))}
    </div>
  ),
};
