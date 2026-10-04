import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleRouteMap } from '@/components/route-map/sampleRouteMap';
import { sampleHome } from '../sampleHome';
import { RouteMapSection } from './RouteMapSection';

const meta = {
  title: 'Sections/RouteMapSection',
  component: RouteMapSection,
  args: { copy: sampleHome.route, map: sampleRouteMap },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof RouteMapSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The map beside the stop list. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: sampleHome.route.headline })).toBeVisible();
    const map = canvas.getByRole('img', { name: sampleRouteMap.description }).getBoundingClientRect();
    const list = canvas.getByRole('list').getBoundingClientRect();
    await expect(list.left).toBeGreaterThan(map.right);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the list wraps below the map. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const map = canvas.getByRole('img', { name: sampleRouteMap.description }).getBoundingClientRect();
    const list = canvas.getByRole('list').getBoundingClientRect();
    await expect(list.top).toBeGreaterThan(map.bottom);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
