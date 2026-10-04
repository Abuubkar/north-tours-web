import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { hunzaPlaces } from '../samplePlaces';
import { PlaceRow } from './PlaceRow';

const meta = {
  title: 'Places map/PlaceRow',
  component: PlaceRow,
  args: { place: hunzaPlaces[0], number: 1, kind: 'Heritage', lit: false, pressed: false, onPoint: fn(), onPick: fn() },
} satisfies Meta<typeof PlaceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A full-width button named by the place, described by its line and kind, at least 44px tall; not pressed. */
export const Default: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const row = canvas.getByRole('button', { name: 'Baltit Fort' });
    await expect(row).toHaveAccessibleDescription(`${hunzaPlaces[0].text} Heritage`);
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.hover(row);
    await expect(args.onPoint).toHaveBeenLastCalledWith('baltit-fort');
    await userEvent.click(row);
    await expect(args.onPick).toHaveBeenCalledWith('baltit-fort');
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** Lit, here or on its pin: the raised surface. Picked, it's pressed. */
export const Picked: Story = {
  args: { lit: true, pressed: true },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Baltit Fort' });
    await expect(row).toHaveAttribute('aria-pressed', 'true');
    await expect(getComputedStyle(row).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

export const PickedOnLight: Story = { ...Picked, globals: { surface: 'light' } };

/** A long line wraps beside the photo. */
export const LongLine: Story = {
  args: { place: { ...hunzaPlaces[6], text: `${hunzaPlaces[6].text} ${hunzaPlaces[6].text}` }, number: 7, kind: 'Viewpoint' },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const LongLineOnLight: Story = { ...LongLine, globals: { surface: 'light', viewport: { value: 'phone' } } };
