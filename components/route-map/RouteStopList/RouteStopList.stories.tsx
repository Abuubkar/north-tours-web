import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleRouteMap } from '../sampleRouteMap';
import { RouteStopList } from './RouteStopList';

const meta = {
  title: 'Route map/RouteStopList',
  component: RouteStopList,
  args: { list: sampleRouteMap.list, stops: sampleRouteMap.stops },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof RouteStopList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An ordered list of six stops with names, elevations and notes; destinations are marked. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list.tagName).toBe('OL');
    const rows = within(list).getAllByRole('listitem');
    await expect(rows).toHaveLength(6);
    await expect(rows[0]).toHaveTextContent('Lahore217 mStart · M-2 motorway north');
    await expect(rows[4]).toHaveTextContent('Hunza2,438 mKarimabad, under Rakaposhi');
    const marked = rows.filter((row) => within(row).queryByRole('img', { name: 'Destination' }));
    await expect(marked).toEqual([rows[4], rows[5]]);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
