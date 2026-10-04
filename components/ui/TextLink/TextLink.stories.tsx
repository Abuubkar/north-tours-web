import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
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

const onClear = fn();

/** The button form: an action that reads like a link, underlined, no arrow, a 44px tap target. */
export const Button: Story = {
  args: { variant: 'button', onClick: onClear, children: 'Clear all', href: undefined },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Clear all' });
    await expect(getComputedStyle(button).textDecorationLine).toBe('underline');
    await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(button.querySelector('svg')).toBeNull();
    await userEvent.click(button);
    await expect(onClear).toHaveBeenCalledOnce();
  },
};

export const ButtonOnLight: Story = { ...Button, globals: { surface: 'light' } };

/** Inline, in a sentence: the sentence's size, underlined, no arrow (inline links are exempt from the 44px target). */
export const Inline: Story = {
  args: { variant: 'inline', href: '/privacy', children: 'Privacy policy' },
  render: (args) => (
    <p>
      We only use your details to plan this trip. <TextLink {...args} />.
    </p>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Privacy policy' });
    await expect(link).toHaveAttribute('href', '/privacy');
    await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    await expect(link.querySelector('svg')).toBeNull();
    await expect(getComputedStyle(link).fontSize).toBe(getComputedStyle(link.parentElement!).fontSize);
  },
};

export const InlineOnLight: Story = { ...Inline, globals: { surface: 'light' } };
