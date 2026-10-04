import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { TextButton } from './TextButton';

const onClick = fn();

const meta = {
  title: 'Base/TextButton',
  component: TextButton,
  args: { children: 'Clear all', onClick },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A button that looks like a link: underlined, at least 44px tall, and it runs its action. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Clear all' });
    await expect(getComputedStyle(button).textDecorationLine).toBe('underline');
    await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(button);
    await expect(onClick).toHaveBeenCalledOnce();
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };
