import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { roomAbove } from '../../../.storybook/scrollRoom';
import { sampleTour } from '../../tour-card/sampleTours';
import { HighlightGrid } from './HighlightGrid';

const highlights = [...sampleTour.highlights, ...sampleTour.highlights.map((h) => ({ ...h, title: `${h.title}, again` }))];

const meta = {
  title: 'Highlights/HighlightGrid',
  component: HighlightGrid,
  args: { highlights },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof HighlightGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Up to three columns. */
export const Desktop: Story = {
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(3);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two at 390. */
export const Phone: Story = {
  beforeEach: emulateReducedMotion,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(2);
  },
};

/** Every ancestor's opacity, from the element up to the card's list item. */
const opacityUpTo = (element: Element, stop: Element) => {
  let opacity = 1;
  for (let el: Element | null = element; el && el !== stop.parentElement; el = el.parentElement) {
    opacity *= Number(getComputedStyle(el).opacity);
  }
  return opacity;
};

/** M4: a card below the fold starts 40px lower with its photo hidden, then rises into place. Text never fades. */
export const RisesIntoView: Story = {
  decorators: [roomAbove],
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const card = canvas.getAllByRole('listitem')[0];
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'below'));
    await expect(getComputedStyle(card).transform).toBe('matrix(1, 0, 0, 1, 0, 40)');
    await expect(opacityUpTo(within(card).getByRole('img'), card)).toBe(0);
    await expect(opacityUpTo(within(card).getByRole('heading'), card)).toBe(1);
    await expect(opacityUpTo(within(card).getByText(highlights[0].text), card)).toBe(1);

    card.scrollIntoView({ block: 'center' });
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'in'));
    await waitFor(() => expect(getComputedStyle(card).transform).toBe('none'), { timeout: 3000 });
    await waitFor(() => expect(opacityUpTo(within(card).getByRole('img'), card)).toBe(1), { timeout: 3000 });
  },
};

export const RisesIntoViewOnLight: Story = { ...RisesIntoView, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** With reduced motion no card is offset, even below the fold. */
export const ReducedMotion: Story = {
  decorators: [roomAbove],
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    for (const card of canvas.getAllByRole('listitem')) {
      await expect(card).not.toHaveAttribute('data-rise');
      await expect(getComputedStyle(card).transform).toBe('none');
    }
  },
};
