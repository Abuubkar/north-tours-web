import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { sampleDepartures } from '../sampleBooking';
import { DepartureOption } from './DepartureOption';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Booking panel/DepartureOption',
  component: DepartureOption,
  args: { name: 'date', departure: sampleDepartures[0], checked: false, onChoose: fn() },
  render: (args) => (
    <fieldset className={styles.aside}>
      <legend>Departure date</legend>
      <DepartureOption {...args} />
    </fieldset>
  ),
} satisfies Meta<typeof DepartureOption>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A radio named by its dates and seats; picking it calls back with its start date. */
export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const radio = canvas.getByRole('radio', { name: '12–20 May 3 of 16 seats left' });
    await userEvent.click(radio);
    await expect(args.onChoose).toHaveBeenCalledWith('2099-05-12');
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Checked: Story = {
  args: { checked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio')).toBeChecked();
  },
};

export const CheckedOnLight: Story = { ...Checked, globals: { surface: 'light' } };

export const SoldOut: Story = {
  args: { departure: sampleDepartures[2] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: '9–17 Jun Sold out · waitlist open' })).toBeVisible();
  },
};

export const SoldOutOnLight: Story = { ...SoldOut, globals: { surface: 'light' } };
