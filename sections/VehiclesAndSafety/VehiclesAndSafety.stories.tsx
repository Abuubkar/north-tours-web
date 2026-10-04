import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleAbout } from '../sampleAbout';
import { VehiclesAndSafety } from './VehiclesAndSafety';

const meta = {
  title: 'Sections/VehiclesAndSafety',
  component: VehiclesAndSafety,
  args: { copy: sampleAbout.vehicles },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof VehiclesAndSafety>;

export default meta;
type Story = StoryObj<typeof meta>;

const vehicles = (canvas: ReturnType<typeof within>) => within(canvas.getAllByRole('list')[0]).getAllByRole('listitem');

/** The vehicles two across beside the safety list; names are <h3>s with their photos, then the fleet's age. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Our vehicles, and how we keep you safe' })).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Toyota Coaster',
      '4x4 jeep',
      'How we keep you safe',
    ]);
    for (const vehicle of sampleAbout.vehicles.items) await expect(canvas.getByRole('img', { name: vehicle.image.alt })).toBeVisible();
    await expect(gridColumns(vehicles(canvas))).toBe(2);
    await expect(canvas.getByText('Average age of our fleet:')).toHaveTextContent('Average age of our fleet: 4 years');
    // The safety list sits beside the fleet.
    const fleet = canvas.getByText('Average age of our fleet:').getBoundingClientRect();
    const safety = canvas.getByRole('heading', { level: 3, name: 'How we keep you safe' }).getBoundingClientRect();
    await expect(safety.left).toBeGreaterThan(fleet.right);
    await expect(within(canvas.getAllByRole('list')[1]).getAllByRole('listitem')).toHaveLength(5);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390: one vehicle across, the safety list under the fleet, nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(vehicles(canvas))).toBe(1);
    const fleet = canvas.getByText('Average age of our fleet:').getBoundingClientRect();
    const safety = canvas.getByRole('heading', { level: 3, name: 'How we keep you safe' }).getBoundingClientRect();
    await expect(safety.top).toBeGreaterThan(fleet.bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
