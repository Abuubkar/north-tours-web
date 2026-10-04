import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleHelpCategories } from '@/sections/sampleHelp';
import { CategoryNav } from './CategoryNav';

const links = sampleHelpCategories.map(({ id, title, questions }) => ({
  id,
  title,
  count: questions.length,
  name: `${title}, ${questions.length} answers`,
}));

const meta = {
  title: 'Help/CategoryNav',
  component: CategoryNav,
  args: { label: 'Help categories', links },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof CategoryNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Only one nav is in the accessibility tree, linking to each category's heading, named with its count. */
const linksEachCategory = async (canvas: ReturnType<typeof within>) => {
  await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
  const nav = canvas.getByRole('navigation', { name: 'Help categories' });
  for (const { id, name } of links) {
    const link = within(nav).getByRole('link', { name });
    await expect(link).toHaveAttribute('href', `#cat-${id}`);
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  }
  return nav;
};

/** At 1440: the sticky list of 44px rows. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const nav = await linksEachCategory(canvas);
    await expect(getComputedStyle(nav).position).toBe('sticky');
    await expect(within(nav).getByRole('link', { name: 'Booking & payment, 4 answers' })).toHaveTextContent('Booking & payment4');
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** At 390: a row of link chips that scrolls sideways on its own; the page doesn't. */
export const Phone: Story = {
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const nav = await linksEachCategory(canvas);
    const row = within(nav).getByRole('list');
    await expect(row.scrollWidth).toBeGreaterThan(row.clientWidth);
    await expect(canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const PhoneOnDark: Story = { ...Phone, globals: { surface: 'dark', viewport: { value: 'phone' } } };
