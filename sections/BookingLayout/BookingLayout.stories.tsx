import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import styles from '../../components/ui/stories.module.css';
import { BookingLayout } from './BookingLayout';

const meta = {
  title: 'Sections/BookingLayout',
  component: BookingLayout,
  args: {
    label: 'Book this tour',
    aside: <p>Booking panel</p>,
    children: <section className={styles.scrollRoom}>Main column</section>,
  },
  parameters: { fullBleed: true },
} satisfies Meta<typeof BookingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 1100px the sections sit beside a sticky aside named "Book this tour". */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const aside = canvas.getByRole('complementary', { name: 'Book this tour' });
    await expect(aside).toBeVisible();
    await expect(getComputedStyle(aside).position).toBe('sticky');
    await expect(aside.getBoundingClientRect().width).toBe(380);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Below 1100px the aside isn't rendered, so only one booking panel is ever in use. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('complementary')).toBeNull();
    await expect(canvas.getByText('Main column')).toBeVisible();
  },
};
