import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { RoomOption } from './RoomOption';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Booking panel/RoomOption',
  component: RoomOption,
  args: { name: 'room', room: 'triple', label: 'Triple', price: 135000, checked: false, onChoose: fn() },
  render: (args) => (
    <fieldset className={styles.row}>
      <legend>Room sharing</legend>
      <RoomOption {...args} />
    </fieldset>
  ),
} satisfies Meta<typeof RoomOption>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A radio named by the room and its price per person. */
export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Triple PKR 135,000' }));
    await expect(args.onChoose).toHaveBeenCalledWith('triple');
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

/** Chosen: the shared selected state. */
export const Checked: Story = {
  args: { checked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Triple PKR 135,000' })).toBeChecked();
  },
};

export const CheckedOnLight: Story = { ...Checked, globals: { surface: 'light' } };
