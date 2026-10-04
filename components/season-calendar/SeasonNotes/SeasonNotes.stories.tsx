import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination, sampleMurree } from '@/components/destination-card/sampleDestinations';
import { gridColumns } from '../../../.storybook/gridColumns';
import { SeasonNotes } from './SeasonNotes';

const meta = {
  title: 'Season calendar/SeasonNotes',
  component: SeasonNotes,
  args: { seasons: sampleDestination.seasons, copy: sampleDestinationCopy.calendar.seasons },
} satisfies Meta<typeof SeasonNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

const notes = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll<HTMLElement>('ul > li')];

/** Four seasons, each an <h3> with its months and note; four across on a wide screen. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Spring', 'Summer', 'Autumn', 'Winter']);
    const spring = within(notes(canvasElement)[0]);
    await expect(spring.getByText('Mar – May')).toBeVisible();
    await expect(spring.getByText(sampleDestination.seasons[0].text)).toBeVisible();
    await expect(gridColumns(notes(canvasElement))).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** One column on phones. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    await expect(gridColumns(notes(canvasElement))).toBe(1);
  },
};

export const Murree: Story = {
  args: { seasons: sampleMurree.seasons },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvasElement }) => {
    await expect(within(notes(canvasElement)[3]).getByText('Dec – Feb')).toBeVisible();
    await expect(notes(canvasElement)[3]).toHaveTextContent(sampleMurree.seasons[3].text);
  },
};

export const MurreePhone: Story = { ...Murree, globals: { viewport: { value: 'phone' } } };
