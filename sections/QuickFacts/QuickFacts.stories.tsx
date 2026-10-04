import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleTourCopy } from '@/components/tour/sampleTourCopy';
import { QuickFacts } from './QuickFacts';

const meta = {
  title: 'Sections/QuickFacts',
  component: QuickFacts,
  args: {
    copy: sampleTourCopy.quickFacts,
    tour: {
      ...sampleTour,
      departures: [
        { start: '2099-05-12', end: '2099-05-20', seatsTotal: 12, seatsLeft: 3 },
        { start: '2099-05-26', end: '2099-06-03', seatsTotal: 16, seatsLeft: 9 },
      ],
    },
    pickupPoint: '[Pickup point], Lahore',
  },
  parameters: { fullBleed: true },
} satisfies Meta<typeof QuickFacts>;

export default meta;
type Story = StoryObj<typeof meta>;

const cells = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll<HTMLElement>('dl > div')];
const value = (canvasElement: HTMLElement, label: string) =>
  cells(canvasElement).find((cell) => cell.querySelector('dt')?.textContent === label)?.querySelector('dd');

/** Five facts in a row; the group size is the largest departure's seats. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvasElement }) => {
    await expect(cells(canvasElement)).toHaveLength(5);
    await expect(gridColumns(cells(canvasElement))).toBe(5);
    await expect(value(canvasElement, 'Difficulty')).toHaveTextContent('Easy walking, long road days');
    await expect(value(canvasElement, 'Group size')).toHaveTextContent('Up to 16 travellers');
    await expect(value(canvasElement, 'Departs from')).toHaveTextContent('[Pickup point], Lahore');
    await expect(value(canvasElement, 'Best season')).toHaveTextContent('April – October');
    await expect(value(canvasElement, 'Transport')).toHaveTextContent('Coaster, with jeeps for Deosai');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390, two columns, and the fifth fact spans the last row. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(2);
    const last = all[4].getBoundingClientRect();
    await expect(Math.round(last.width)).toBeGreaterThan(Math.round(all[0].getBoundingClientRect().width * 2));
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With no departures left there's no group size, and the four facts fill two rows. */
export const NoDepartures: Story = {
  args: { tour: { ...sampleTour, departures: [] } },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(cells(canvasElement)).toHaveLength(4);
    await expect(value(canvasElement, 'Group size')).toBeUndefined();
  },
};

/** At 820 (four columns) the fifth fact also takes the whole second row. */
export const NavBreakpoint: Story = {
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(4);
    await expect(Math.round(all[4].getBoundingClientRect().width)).toBeGreaterThan(Math.round(all[0].getBoundingClientRect().width * 3));
  },
};
