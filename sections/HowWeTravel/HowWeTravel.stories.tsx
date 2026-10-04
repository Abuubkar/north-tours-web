import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleAbout } from '../sampleAbout';
import { HowWeTravel } from './HowWeTravel';

const meta = {
  title: 'Sections/HowWeTravel',
  component: HowWeTravel,
  args: { copy: sampleAbout.principles },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof HowWeTravel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four principles in an unordered list, four across, each title an <h3>, with no numbers. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'How we run every trip' })).toBeVisible();
    const list = canvas.getByRole('list');
    await expect(list.tagName).toBe('UL');
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(4);
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Unhurried pace',
      'Local guides',
      'Clear prices',
      'Safety first',
    ]);
    await expect(list.textContent).not.toMatch(/\d/);
    await expect(gridColumns(items)).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/**
 * One column at 390. The first and last text line up with the page margins (the bleed holds),
 * and nothing scrolls sideways.
 */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(1);
    const heading = canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    const title = canvas.getAllByRole('heading', { level: 3 })[0].getBoundingClientRect();
    await expect(Math.round(title.left)).toBe(Math.round(heading.left));
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** At 1440 the last column's text ends at the right page margin. */
export const DesktopAligned: Story = {
  play: async ({ canvas }) => {
    const section = canvas.getByRole('heading', { level: 2 }).closest('section')!;
    const right = section.getBoundingClientRect().right - parseFloat(getComputedStyle(section).paddingRight);
    const last = canvas.getAllByRole('listitem').at(-1)!;
    const lastText = last.getBoundingClientRect().right - parseFloat(getComputedStyle(last).paddingRight);
    await expect(Math.round(lastText)).toBe(Math.round(right));
  },
};
