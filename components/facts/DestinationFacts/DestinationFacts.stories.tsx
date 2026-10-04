import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination } from '@/components/destination-card/sampleDestinations';
import { gridColumns } from '../../../.storybook/gridColumns';
import { DestinationFacts } from './DestinationFacts';

const meta = {
  title: 'Facts/DestinationFacts',
  component: DestinationFacts,
  args: { destination: sampleDestination, tourCount: 2, copy: sampleDestinationCopy.facts },
} satisfies Meta<typeof DestinationFacts>;

export default meta;
type Story = StoryObj<typeof meta>;

const value = (canvasElement: HTMLElement, label: string) =>
  [...canvasElement.querySelectorAll('dt')].find((dt) => dt.textContent === label)?.nextElementSibling;

/** Each fact shows its label and value: the best season, the altitude, the road from Lahore and the tours. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvasElement }) => {
    await expect(value(canvasElement, 'Best season')).toHaveTextContent('April – October');
    await expect(value(canvasElement, 'Altitude')).toHaveTextContent('2,438 m');
    await expect(value(canvasElement, 'From Lahore')).toHaveTextContent('3 days by road');
    await expect(value(canvasElement, 'Tours')).toHaveTextContent('2');
    await expect(gridColumns([...canvasElement.querySelectorAll<HTMLElement>('dl > div')])).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(gridColumns([...canvasElement.querySelectorAll<HTMLElement>('dl > div')])).toBe(2);
  },
};

/** No tour visits yet: the Tours fact is left out, never "0". */
export const NoTours: Story = {
  args: { tourCount: 0 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByText('Tours')).toBeNull();
    await expect(canvasElement.querySelectorAll('dt')).toHaveLength(3);
  },
};
