import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { placeholderSettings } from '../../layout/sampleSettings';
import { tourWith } from '../sampleTours';
import { RelatedTours } from './RelatedTours';

/*
 * `builtOn` is a fixed day in the past and the browser's real today is later, so the re-check
 * after hydration drops a tour whose only date (2020) has passed, as on a stale build.
 */
const tour = (title: string, destinations: string[], departures: [string, number][]) => ({ ...tourWith(title, departures), destinations });
const tours = [
  tour('Hunza & Skardu Grand', ['hunza', 'skardu'], [['2099-05-12', 3]]),
  tour('Left already', ['hunza'], [['2020-06-01', 5]]),
  tour('Hunza Express', ['hunza'], [['2099-06-02', 12]]),
  tour('Swat Family Escape', ['swat'], [['2099-06-05', 9]]),
  tour('Naran-Kaghan Getaway', ['naran-kaghan'], [['2099-05-22', 11]]),
  tour('Skardu & Deosai', ['skardu'], [['2099-07-16', 3]]),
];

const meta = {
  title: 'Tour card/RelatedTours',
  component: RelatedTours,
  args: { tour: { slug: tours[0].slug, destinations: tours[0].destinations }, tours, builtOn: '2020-01-01', settings: placeholderSettings },
  beforeEach: emulateReducedMotion,
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof RelatedTours>;

export default meta;
type Story = StoryObj<typeof meta>;

const titles = (canvas: ReturnType<typeof within>) => canvas.getAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

/**
 * Three cards, none for the page's own tour: those sharing a destination first, then the soonest.
 * A tour whose dates have passed drops out in the browser and the next fills in.
 */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await waitFor(() => expect(titles(canvas)).not.toContain('Left already'));
    await expect(titles(canvas)).toEqual(['Hunza Express', 'Skardu & Deosai', 'Naran-Kaghan Getaway']);
    await expect(titles(canvas)).not.toContain('Hunza & Skardu Grand');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };
