import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import styles from '../../ui/stories.module.css';
import { PlacePin } from './PlacePin';

const meta = {
  title: 'Places map/PlacePin',
  component: PlacePin,
  args: {
    id: 'attabad-lake',
    name: 'Attabad Lake',
    number: 4,
    position: { '--x': '50%', '--y': '50%' } as CSSProperties,
    lit: false,
    pressed: false,
    onPoint: fn(),
    onPick: fn(),
  },
  decorators: [
    (Story) => (
      <div className={styles.pinStage}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlacePin>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Off: a 44px button named by its place, with its number; hover and click report the place. */
export const Off: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const pin = canvas.getByRole('button', { name: 'Attabad Lake' });
    await expect(pin).toHaveAttribute('aria-pressed', 'false');
    await expect(pin.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(pin).toHaveTextContent('4');
    await userEvent.hover(pin);
    await expect(args.onPoint).toHaveBeenLastCalledWith('attabad-lake', 'hover');
    await userEvent.click(pin);
    await expect(args.onPick).toHaveBeenCalledWith('attabad-lake');
  },
};

export const OffOnLight: Story = { ...Off, globals: { surface: 'light' } };

/** Lit and picked: pressed, with the place's name beside it. */
export const Lit: Story = {
  args: { lit: true, pressed: true },
  play: async ({ canvas }) => {
    const pin = canvas.getByRole('button', { name: 'Attabad Lake' });
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Attabad Lake')).toBeVisible();
  },
};

export const LitOnLight: Story = { ...Lit, globals: { surface: 'light' } };
