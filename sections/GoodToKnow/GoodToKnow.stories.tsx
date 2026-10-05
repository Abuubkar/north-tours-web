import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination } from '@/components/destination-card/sampleDestinations';
import { expectOpenHairlines, gridColumns } from '../../.storybook/gridColumns';
import { GoodToKnow } from './GoodToKnow';

const notes = sampleDestination.notes!;

const meta = {
  title: 'Sections/GoodToKnow',
  component: GoodToKnow,
  args: { copy: sampleDestinationCopy.goodToKnow, notes },
  parameters: { fullBleed: true },
} satisfies Meta<typeof GoodToKnow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the light surface: the H2, then each note's title as an H3 with its text; three across on a wide screen. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Good to know before you go' }).closest('[data-surface]')).toHaveAttribute('data-surface', 'light');
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(args.notes.length);
    for (const [i, note] of args.notes.entries()) {
      await expect(within(items[i]).getByRole('heading', { level: 3, name: note.title })).toBeVisible();
      await expect(within(items[i]).getByText(note.text)).toBeVisible();
    }
    await expect(gridColumns(items)).toBe(3);
  },
};

/** One column on phones, each note still its title and text. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, args }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(args.notes.length);
    for (const [i, note] of args.notes.entries()) {
      await expect(within(items[i]).getByRole('heading', { level: 3, name: note.title })).toBeVisible();
      await expect(within(items[i]).getByText(note.text)).toBeVisible();
    }
    await expect(gridColumns(items)).toBe(1);
  },
};

/** Three notes fill one row. */
export const ThreeNotes: Story = { ...Desktop, args: { notes: notes.slice(0, 3) } };

export const ThreeNotesPhone: Story = { ...Phone, args: { notes: notes.slice(0, 3) } };

/**
 * Four notes in three columns (Fairy Meadows, Skardu): the fourth sits alone in the last row, and
 * the grid paints nothing beside it, so no grey empty cells (owner feedback).
 */
export const FourNotes: Story = {
  ...Desktop,
  args: { notes: notes.slice(0, 4) },
  play: async (context) => {
    await Desktop.play!(context);
    await expectOpenHairlines(context.canvas.getByRole('list'));
  },
};
