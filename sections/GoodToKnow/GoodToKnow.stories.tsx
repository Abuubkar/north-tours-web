import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleDestination } from '@/components/destination-card/sampleDestinations';
import { gridColumns } from '../../.storybook/gridColumns';
import { GoodToKnow } from './GoodToKnow';

const notes = sampleDestination.notes!;

const meta = {
  title: 'Sections/GoodToKnow',
  component: GoodToKnow,
  args: { headline: 'Good to know before you go', notes },
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

export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(1);
  },
};

/** Three notes fill one row. */
export const ThreeNotes: Story = { ...Desktop, args: { notes: notes.slice(0, 3) } };

export const ThreeNotesPhone: Story = { ...Phone, args: { notes: notes.slice(0, 3) }, play: async ({ canvas }) => {
  await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
} };
