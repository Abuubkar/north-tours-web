import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { TextOrLink } from './TextOrLink';

const meta = {
  title: 'Base/TextOrLink',
  component: TextOrLink,
  args: { href: 'tel:+924235781234', className: '', children: '+92 42 3578 1234' },
} satisfies Meta<typeof TextOrLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A real value is a link. */
export const Link: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
  },
};

export const LinkOnLight: Story = { ...Link, globals: { surface: 'light' } };

/** A placeholder has no link: it shows as written, as plain text. */
export const Placeholder: Story = {
  args: { href: undefined, children: '[+92 42 XXXX XXXX]' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('[+92 42 XXXX XXXX]')).toBeVisible();
    await expect(canvas.queryByRole('link')).toBeNull();
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };
