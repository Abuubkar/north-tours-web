import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import styles from '../../ui/stories.module.css';
import { SeeAllToursCell } from './SeeAllToursCell';

const meta = {
  title: 'Tour card/SeeAllToursCell',
  component: SeeAllToursCell,
  args: { title: 'See all Hunza trips', note: 'Opens the Tours page, filtered to Hunza', href: '/tours?dest=hunza' },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SeeAllToursCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One link, named "See all Hunza trips", described by its note, to Tours filtered to Hunza; at least 200px tall. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'See all Hunza trips' });
    await expect(link).toHaveAttribute('href', '/tours?dest=hunza');
    await expect(link).toHaveAccessibleDescription('Opens the Tours page, filtered to Hunza');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(200);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
