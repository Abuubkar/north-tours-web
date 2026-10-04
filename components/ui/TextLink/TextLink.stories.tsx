import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TextLink } from './TextLink';

const meta = {
  title: 'Base/TextLink',
  component: TextLink,
  args: { href: '/about#guides', children: 'Meet the team' },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Underlined, with an arrow the screen reader skips, and a 44px tap target. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Meet the team' });
    await expect(link).toHaveAttribute('href', '/about#guides');
    await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

/** A back link: the arrow first, no underline, still a 44px tap target. */
export const Back: Story = {
  args: { href: '/tours', children: 'All tours', variant: 'back' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'All tours' });
    await expect(link).toHaveAttribute('href', '/tours');
    await expect(getComputedStyle(link).textDecorationLine).toBe('none');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const BackOnLight: Story = { ...Back, globals: { surface: 'light' } };
