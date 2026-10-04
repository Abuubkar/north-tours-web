import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { StatCell } from './StatCell';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'About/StatCell',
  component: StatCell,
  args: { value: '12', label: 'years running trips' },
  decorators: [
    (Story) => (
      <ul className={styles.card}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof StatCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The figure at the numeral size (light, tabular), then its label, read together. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem')).toHaveTextContent('12years running trips');
    const value = getComputedStyle(canvas.getByText('12'));
    await expect(value.fontWeight).toBe('300');
    await expect(value.fontVariantNumeric).toBe('tabular-nums');
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
