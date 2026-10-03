import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { NavLinks } from './NavLinks';

const meta = {
  title: 'Layout/NavLinks',
  component: NavLinks,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/about' } } },
} satisfies Meta<typeof NavLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the About page, Guides is the current item (gold). */
export const OnAboutPage: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Guides' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/about#guides');
  },
};

export const OnAboutPageOnLight: Story = { ...OnAboutPage, globals: { surface: 'light' } };
