import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { IconButton } from './IconButton';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/IconButton',
  component: IconButton,
  args: { icon: 'close', label: 'Close', size: 44, onClick: fn() },
  argTypes: { size: { control: 'inline-radio', options: [44, 48] } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Gallery: Story = {
  render: () => (
    <div className={styles.row}>
      <IconButton icon="close" label="Close" />
      <IconButton icon="arrowLeft" label="Previous profile" />
      <IconButton icon="arrowRight" label="Next profile" />
      <IconButton icon="minus" label="Fewer travellers" />
      <IconButton icon="plus" label="More travellers" />
      <IconButton icon="whatsapp" label="Ask about this trip on WhatsApp" size={48} />
      <IconButton icon="minus" label="Fewer travellers (at minimum)" disabled />
    </div>
  ),
};

/** The same set on the light surface, so axe checks light contrast too. */
export const GalleryOnLight: Story = {
  ...Gallery,
  globals: { surface: 'light' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-surface]')).toHaveAttribute('data-surface', 'light');
  },
};

/** WhatsApp links are real links with an accessible name. */
export const AsLink: Story = {
  args: { icon: 'whatsapp', label: 'Chat on WhatsApp', href: 'https://wa.me/', size: 48 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/',
    );
  },
};

export const Disabled: Story = {
  args: { icon: 'minus', label: 'Fewer travellers', disabled: true },
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Fewer travellers' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Icon buttons are at least the 44px tap target. */
export const TapTarget: Story = {
  play: async ({ canvas }) => {
    const { width, height } = canvas.getByRole('button', { name: 'Close' }).getBoundingClientRect();
    await expect(Math.min(width, height)).toBeGreaterThanOrEqual(44);
  },
};
