import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { PrincipleCell } from './PrincipleCell';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'About/PrincipleCell',
  component: PrincipleCell,
  args: { title: 'Unhurried pace', text: 'We plan around the weather, the roads and your family.' },
  decorators: [
    (Story) => (
      <ul className={styles.card}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof PrincipleCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A list item: the title is a heading, then the line. No number. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const item = canvas.getByRole('listitem');
    await expect(canvas.getByRole('heading', { level: 3, name: 'Unhurried pace' })).toBeVisible();
    await expect(canvas.getByText('We plan around the weather, the roads and your family.')).toBeVisible();
    await expect(item.textContent).not.toMatch(/\d/);
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
