import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { hunzaPlaces } from '../samplePlaces';
import { PlaceRow } from './PlaceRow';

const meta = {
  title: 'Places map/PlaceRow',
  component: PlaceRow,
  args: { place: hunzaPlaces[0], number: 1, kind: 'Heritage' },
} satisfies Meta<typeof PlaceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A full-width button named by the place, described by its line and kind, at least 44px tall. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Baltit Fort' });
    await expect(row).toHaveAccessibleDescription(`${hunzaPlaces[0].text} Heritage`);
    await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** A long line wraps beside the photo. */
export const LongLine: Story = {
  args: { place: { ...hunzaPlaces[6], text: `${hunzaPlaces[6].text} ${hunzaPlaces[6].text}` }, number: 7, kind: 'Viewpoint' },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
