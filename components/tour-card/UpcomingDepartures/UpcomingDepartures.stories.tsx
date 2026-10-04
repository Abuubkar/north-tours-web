import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { opacityUpTo } from '../../../.storybook/opacity';
import { roomAbove } from '../../../.storybook/scrollRoom';
import { placeholderSettings } from '../../layout/sampleSettings';
import { sampleTour, tourWith } from '../sampleTours';
import { UpcomingDepartures } from './UpcomingDepartures';

/*
 * `builtOn` is a fixed day in the past; the browser's real today is later, so the grid's
 * re-check after hydration drops anything that left in between (2020 here), as on a stale build.
 */
const future = [
  tourWith('Naran-Kaghan Getaway', [['2099-05-22', 11]]),
  tourWith('Hunza & Skardu Grand', [['2099-05-12', 3], ['2099-05-26', 9]]),
  tourWith('Swat Family Escape', [['2099-06-05', 9]]),
  tourWith('Fairy Meadows Trek', [['2099-06-14', 0], ['2099-07-12', 7]]),
  tourWith('Murree & Galiyat Weekend', [['2099-05-29', 14]]),
];

const titles = (canvas: ReturnType<typeof within>) =>
  canvas.queryAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

const meta = {
  title: 'Tour card/UpcomingDepartures',
  component: UpcomingDepartures,
  args: { tours: future, builtOn: '2020-01-01', limit: 4, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof UpcomingDepartures>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four cards, one per tour, soonest first; a sold-out next date gives way to one with seats. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    await expect(titles(canvas)).toEqual([
      'Hunza & Skardu Grand',
      'Naran-Kaghan Getaway',
      'Murree & Galiyat Weekend',
      'Swat Family Escape',
    ]);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** One column at 390. */
export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

/** 1366: the four cards share a row, and their View Trip buttons line up although the titles wrap differently. */
export const Laptop: Story = {
  ...Desktop,
  globals: { viewport: { value: 'laptop' } },
  play: async (context) => {
    await Desktop.play!(context);
    const buttons = context.canvas.getAllByRole('link', { name: /^View Trip/ });
    const tops = buttons.map((b) => Math.round(b.getBoundingClientRect().top));
    await expect(tops).toHaveLength(4);
    await expect(new Set(tops).size).toBe(1);
  },
};

/** A departure that left after the build is dropped in the browser, and the next tour fills in. */
export const StaleBuild: Story = {
  args: {
    tours: [
      tourWith('Left already', [['2020-06-01', 5]]),
      tourWith('Moved on', [['2020-06-02', 5], ['2099-08-01', 5]]),
      ...future,
    ],
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(titles(canvas)).not.toContain('Left already'));
    await expect(titles(canvas)).toEqual([
      'Hunza & Skardu Grand',
      'Naran-Kaghan Getaway',
      'Murree & Galiyat Weekend',
      'Swat Family Escape',
    ]);
    await expect(canvas.queryByText(/2 Jun/)).toBeNull();
  },
};

/** Nothing left: the grid gives way to a WhatsApp link. */
export const NoneLeft: Story = {
  args: { tours: [tourWith('Left already', [['2020-06-01', 5]])] },
  play: async ({ canvas }) => {
    const link = await canvas.findByRole('link', { name: 'No upcoming dates · ask on WhatsApp' });
    await expect(link).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/\?text=/));
    await expect(canvas.queryByRole('list')).toBeNull();
  },
};

export const NoneLeftOnLight: Story = { ...NoneLeft, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/**
 * M4: a card below the fold waits 40px lower with its photo hidden, then rises once into place
 * when it comes into view. Its dates, price, seats and buttons are never faded.
 */
export const RisesIntoView: Story = {
  decorators: [roomAbove],
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const card = canvas.getAllByRole('listitem')[0];
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'below'));
    await expect(getComputedStyle(card).transform).toBe('matrix(1, 0, 0, 1, 0, 40)');
    const photo = within(card).getByRole('img', { name: sampleTour.image.alt });
    await expect(opacityUpTo(photo, card)).toBe(0);
    for (const essential of [
      within(card).getByText('Only 3 seats left'),
      within(card).getByText('12–12 May · 1 day'),
      within(card).getByText('PKR 145,000'),
      within(card).getByText('3 of 16 seats left'),
      within(card).getByRole('link', { name: /^View Trip/ }),
    ]) {
      await expect(opacityUpTo(essential, card)).toBe(1);
    }

    card.scrollIntoView({ block: 'center' });
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'in'));
    await waitFor(() => expect(getComputedStyle(card).transform).toBe('none'), { timeout: 3000 });
    await waitFor(() => expect(opacityUpTo(photo, card)).toBe(1), { timeout: 3000 });
  },
};

/** No card is offset (the hook left them alone). */
const expectNoCardOffset = async (canvas: ReturnType<typeof within>) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  for (const card of canvas.getAllByRole('listitem')) {
    await expect(card).not.toHaveAttribute('data-rise');
    await expect(getComputedStyle(card).transform).toBe('none');
  }
};

export const RisesIntoViewOnLight: Story = { ...RisesIntoView, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Cards already in view when the page loads are never offset. */
export const InViewAtLoad: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => expectNoCardOffset(canvas),
};

/** With reduced motion, no card is offset, even below the fold. */
export const ReducedMotion: Story = {
  decorators: [roomAbove],
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => expectNoCardOffset(canvas),
};

export const ReducedMotionOnLight: Story = { ...ReducedMotion, globals: { surface: 'light', viewport: { value: 'desktop' } } };
