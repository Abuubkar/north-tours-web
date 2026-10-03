import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { IconButton } from './IconButton';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/IconButton',
  component: IconButton,
  args: { icon: 'menu', label: 'Menu', size: 44, onClick: fn() },
  argTypes: { size: { control: 'inline-radio', options: [44, 48] } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Gallery: Story = {
  render: () => (
    <div className={styles.row}>
      <IconButton icon="menu" label="Menu" />
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
