import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { placeholderSettings } from '../../layout/sampleSettings';
import { sampleListTours } from '../sampleFilters';
import { ResultsGrid } from './ResultsGrid';

const results = sampleListTours.slice(0, 4).map((tour) => ({ tour, departure: tour.departures[0] }));

const meta = {
  title: 'Filters/ResultsGrid',
  component: ResultsGrid,
  args: { results, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof ResultsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cells = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll('li')];
const rightLine = (cell: Element) => getComputedStyle(cell).borderRightWidth;

/**
 * 1440: three columns. Every card has a line under it and a line to its right unless it ends the
 * row, and the short last row simply ends: nothing is painted in the line colour beside it.
 */
export const ThreeColumns: Story = {
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(3);
    await expect(all.map(rightLine)).toEqual(['1px', '1px', '0px', '1px']);
    await expect(all.map((cell) => getComputedStyle(cell).borderBottomWidth)).toEqual(['1px', '1px', '1px', '1px']);
    await expect(getComputedStyle(canvasElement.querySelector('ul')!).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

export const ThreeColumnsOnLight: Story = { ...ThreeColumns, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** 1366: still three columns, and the buttons line up across a row (WhatsApp is on every card). */
export const Laptop: Story = {
  globals: { viewport: { value: 'laptop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(cells(canvasElement))).toBe(3);
    const tops = canvas.getAllByRole('link', { name: /on WhatsApp$/ }).slice(0, 3).map((b) => Math.round(b.getBoundingClientRect().top));
    await expect(new Set(tops).size).toBe(1);
  },
};

/** From 820px to 1100px: two columns, the line between them only. */
export const TwoColumns: Story = {
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(2);
    await expect(all.map(rightLine)).toEqual(['1px', '0px', '1px', '0px']);
  },
};

/** 390: one column, a line under each card, nothing to the side, and nothing scrolls sideways. */
export const OneColumn: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(1);
    await expect(all.map(rightLine)).toEqual(['0px', '0px', '0px', '0px']);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const OneColumnOnLight: Story = { ...OneColumn, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The first row's photos (three, the widest layout) load straight away; the rest lazily. */
export const FirstRowLoadsFirst: Story = {
  play: async ({ canvasElement }) => {
    const loading = [...canvasElement.querySelectorAll('img')].map((img) => img.getAttribute('loading'));
    await expect(loading).toEqual(['eager', 'eager', 'eager', 'lazy']);
  },
};
