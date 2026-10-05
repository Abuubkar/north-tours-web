import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { mapStandIn } from './sampleOfficeMap';
import { OfficeMap } from './OfficeMap';

const meta = {
  title: 'Contact/OfficeMap',
  component: OfficeMap,
  args: mapStandIn,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof OfficeMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The map frame, named by its title, loading lazily in a 4:3 frame at the card radius, then the
 * link to the full map. A stand-in page fills the frame, so the story never calls Google.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const frame = canvas.getByTitle(mapStandIn.title);
    await expect(frame.tagName).toBe('IFRAME');
    await expect(frame).toHaveAttribute('loading', 'lazy');
    await expect(frame).toHaveAttribute('src', mapStandIn.src);
    const box = frame.getBoundingClientRect();
    await expect(box.width / box.height).toBeCloseTo(4 / 3, 1);
    await expect(getComputedStyle(frame).borderRadius).toBe('8px');
    await expect(canvas.getByRole('link', { name: mapStandIn.linkLabel })).toHaveAttribute('href', mapStandIn.href);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the frame takes the full width, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByTitle(mapStandIn.title).getBoundingClientRect().width).toBeGreaterThan(300);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
