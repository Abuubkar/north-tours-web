import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { drawsLines, gridColumns, gridGaps } from '../../../.storybook/gridColumns';
import { emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { placeholderSettings } from '../../layout/sampleSettings';
import { sampleListTours } from '../sampleFilters';
import { ResultsGrid } from './ResultsGrid';

const toResults = (tours: typeof sampleListTours) => tours.map((tour) => ({ tour, departure: tour.departures[0] }));
const results = toResults(sampleListTours.slice(0, 4));
/** All eight, so the run after the banner has rows to measure. */
const allResults = toResults(sampleListTours);

const meta = {
  title: 'Filters/ResultsGrid',
  component: ResultsGrid,
  args: { results, ready: true, changes: 0, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof ResultsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cells = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll('li')];
/** The cards after the banner, one list. */
const restCells = (canvasElement: HTMLElement) => [...[...canvasElement.querySelectorAll('ul')].at(-1)!.querySelectorAll('li')];
/** No line anywhere: not on the list, not on a card's cell. */
const expectNoLines = async (canvasElement: HTMLElement) => {
  for (const element of [...canvasElement.querySelectorAll('ul'), ...cells(canvasElement)]) await expect(drawsLines(element)).toBe(false);
};

/**
 * 1440: three columns, 24px between cards side by side and 48px between rows, with no lines; the
 * short last row simply ends.
 */
export const ThreeColumns: Story = {
  args: { results: allResults },
  // Cards below the fold would wait 40px lower to rise; measure them in place.
  beforeEach: emulateReducedMotion,
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(3);
    await expect(gridGaps(restCells(canvasElement))).toEqual({ column: 24, row: 48 });
    await expectNoLines(canvasElement);
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

/** From 820px to 1100px: two columns, the same gaps. */
export const TwoColumns: Story = {
  args: { results: allResults },
  beforeEach: emulateReducedMotion,
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(2);
    await expect(gridGaps(restCells(canvasElement))).toEqual({ column: 24, row: 48 });
    await expectNoLines(canvasElement);
  },
};

/** 390: one column, 48px between cards, no lines, and nothing scrolls sideways. */
export const OneColumn: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    const all = cells(canvasElement);
    await expect(gridColumns(all)).toBe(1);
    await expect(gridGaps(all)).toEqual({ column: null, row: 48 });
    await expectNoLines(canvasElement);
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
