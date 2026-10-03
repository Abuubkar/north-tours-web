import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleRouteMap } from '../sampleRouteMap';
import { RouteMap } from './RouteMap';

const meta = {
  title: 'Route map/RouteMap',
  component: RouteMap,
  args: { map: sampleRouteMap },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof RouteMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One image with a short description; the drawing and its labels are hidden from screen readers. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    const map = canvas.getByRole('img', { name: sampleRouteMap.description });
    await expect(map).toBeVisible();
    await expect(canvas.getAllByRole('img')).toHaveLength(1);
    await expect(canvas.getByText('Motorway + Karakoram Highway')).toBeVisible();
    // Every stop label is drawn inside the frame.
    const frame = map.getBoundingClientRect();
    for (const name of sampleRouteMap.stops.map((s) => s.name)) {
      const label = [...canvasElement.querySelectorAll('span')].find((s) => s.firstChild?.textContent === name)!;
      const box = label.getBoundingClientRect();
      await expect(box.left >= frame.left && box.right <= frame.right && box.top >= frame.top && box.bottom <= frame.bottom).toBe(true);
    }
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the map shrinks but the labels keep their size, and stay inside the frame. */
export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
