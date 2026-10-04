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
    for (const [i, row] of rows.entries()) {
      const square = row.firstElementChild!;
      await expect(square).toHaveAttribute('aria-hidden', 'true');
      await expect(square.getBoundingClientRect().width).toBe(18);
      await expect(getComputedStyle(square).borderRadius).toBe('2px');
      // Only the practice is read out: no ✓ glyph, no image.
      await expect(row.textContent).toBe(sampleAbout.vehicles.safety.items[i]);
      await expect(within(row).queryByRole('img')).toBeNull();
    }
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
