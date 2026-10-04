import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleAbout } from '@/sections/sampleAbout';
import { CheckList } from './CheckList';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'About/CheckList',
  component: CheckList,
  args: { title: sampleAbout.vehicles.safety.title, items: sampleAbout.vehicles.safety.items },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The title as an <h3>, then five practices in a list; each ✓ square is hidden from screen readers. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'How we keep you safe' })).toBeVisible();
    const rows = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(rows).toHaveLength(5);
    for (const row of rows) {
      const square = row.querySelector('[aria-hidden="true"]')!;
      await expect(square.getBoundingClientRect().width).toBe(18);
      await expect(getComputedStyle(square).borderRadius).toBe('2px');
      await expect(row).toHaveAccessibleName('');
    }
    await expect(rows[0]).toHaveTextContent(sampleAbout.vehicles.safety.items[0]);
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
