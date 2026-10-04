import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination, sampleMurree } from '@/components/destination-card/sampleDestinations';
import { gridColumns } from '../../../.storybook/gridColumns';
import { SeasonCalendar } from './SeasonCalendar';

const meta = {
  title: 'Season calendar/SeasonCalendar',
  component: SeasonCalendar,
  args: { months: sampleDestination.months, copy: sampleDestinationCopy.calendar },
} satisfies Meta<typeof SeasonCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const months = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll<HTMLElement>('ol > li')];

/** Twelve months in an ordered list, each named in full with its level; twelve columns from 820px. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const cells = months(canvasElement);
    await expect(cells).toHaveLength(12);
    await expect(cells[0]).toHaveTextContent('January: Avoid');
    await expect(cells[3]).toHaveTextContent('April: Best');
    await expect(cells[10]).toHaveTextContent('November: Good');
    await expect(cells[11]).toHaveTextContent('December: Avoid');
    await expect(canvas.getByText('Avoid · closed or not recommended')).toBeVisible();
    await expect(gridColumns(cells)).toBe(12);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Six columns on phones, as designed. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    const cells = months(canvasElement);
    await expect(cells).toHaveLength(12);
    await expect(gridColumns(cells)).toBe(6);
    await expect(cells[6]).toHaveTextContent('July: Best');
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Murree: good months in the middle of its best season (the monsoon). */
export const Murree: Story = {
  args: { months: sampleMurree.months },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvasElement }) => {
    const cells = months(canvasElement);
    await expect(cells.map((cell) => cell.textContent)).toEqual([
      'JanJanuary: Avoid',
      'FebFebruary: Good',
      'MarMarch: Good',
      'AprApril: Good',
      'MayMay: Best',
      'JunJune: Best',
      'JulJuly: Good',
      'AugAugust: Good',
      'SepSeptember: Best',
      'OctOctober: Best',
      'NovNovember: Good',
      'DecDecember: Good',
    ]);
  },
};

export const MurreePhone: Story = {
  args: { months: sampleMurree.months },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(gridColumns(months(canvasElement))).toBe(6);
  },
};
