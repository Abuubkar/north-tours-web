import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { opacityUpTo } from '../../../.storybook/opacity';
import { realUser } from '../../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { roomAbove } from '../../../.storybook/scrollRoom';
import { sampleAbout } from '@/sections/sampleAbout';
import { sampleProfiles } from '../sampleProfiles';
import { GuideTeam } from './GuideTeam';

const meta = {
  title: 'Guide profile/GuideTeam',
  component: GuideTeam,
  args: { profiles: sampleProfiles, copy: sampleAbout.guides },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
  beforeEach: emulateReducedMotion,
} satisfies Meta<typeof GuideTeam>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

/** A guide's card: named by its words, the guide's name first ("Ali Raza Guide · Skardu & Deosai View profile"). */
const cardName = (name: string) => new RegExp(`^${name} `);

/** Opens a guide's profile from their card with a real key press (Enter or Space), as a keyboard user would. */
async function openWithKey(canvas: Canvas, name: string, key: '{Enter}' | ' ' = '{Enter}') {
  const card = canvas.getByRole('button', { name: cardName(name) });
  card.focus();
  const keys = await realUser();
  if (keys) await keys.keyboard(key);
  else card.click();
  const dialog = await canvas.findByRole('dialog', { name });
  return { card, dialog };
}

const counter = (dialog: HTMLElement, text: string) => within(dialog).getByText(text);

/** The rows' labels and values, in order. */
const rows = (dialog: HTMLElement) =>
  within(dialog)
    .getAllByRole('term')
    .map((term) => `${term.textContent}: ${term.nextElementSibling?.textContent}`);

/** Four across at 1440, every card a button that opens a dialog, carrying the guide's anchor. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole('button');
    await expect(cards.map((c) => c.getAttribute('id'))).toEqual(sampleProfiles.map((p) => `guide-${p.slug}`));
    for (const card of cards) await expect(card).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(2);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * From 820px: Enter on a card opens the side drawer, named by the guide, with focus on Close.
 * The page behind is inert, the card shows as the one open, and the profile has its rows (no
 * Licence in the sample content), the share link and its address in Geist.
 */
export const OpensDrawer: Story = {
  play: async ({ canvas }) => {
    const { card, dialog } = await openWithKey(canvas, 'Ali Raza');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus());
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().right)).toBe(window.innerWidth));
    await expect(Math.round(dialog.getBoundingClientRect().width)).toBe(460);
    await expect(dialog.matches(':modal')).toBe(true);
    // The page behind is inert: another card can't take focus.
    const other = canvas.getByRole('button', { name: cardName('Karim Baig'), hidden: true });
    other.focus();
    await expect(other).not.toHaveFocus();
    await expect(getComputedStyle(card).backgroundColor).not.toBe(getComputedStyle(other).backgroundColor);

    await expect(counter(dialog, '3 of 6')).toBeVisible();
    await expect(within(dialog).getByText('Guide · Skardu & Deosai')).toBeVisible();
    await expect(rows(dialog)).toEqual([
      'Home valley: Skardu, Baltistan',
      'With us: Since 2018',
      'Languages: Balti, Urdu, English',
      'Leads: Skardu, Deosai, Shigar',
    ]);
    await expect(within(dialog).queryByText('Licence')).toBeNull();

    const share = within(dialog).getByRole('link', { name: 'Share this profile on WhatsApp' });
    await expect(share.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
    await expect(decodeURIComponent(share.getAttribute('href')!.split('text=')[1])).toBe(
      'Meet Ali Raza, our guide: [Site URL]/about#guide-ali-raza',
    );
    await expect(share).toHaveAttribute('target', '_blank');
    await expect(share).toHaveAttribute('rel', 'noopener');

    const path = within(dialog).getByText('/about#guide-ali-raza');
    await expect(getComputedStyle(path).fontFamily).not.toMatch(/mono|menlo|consolas/i);
    // The portrait is 4:5 in the drawer.
    const portrait = within(dialog).getByRole('img', { name: 'Ali Raza, guide' }).getBoundingClientRect();
    await expect(portrait.width / portrait.height).toBeCloseTo(0.8, 1);
  },
};

export const OpensDrawerOnLight: Story = { ...OpensDrawer, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Below 820px: Space on a card opens the bottom sheet, full width at the foot of the screen, the portrait 4:3. */
export const OpensBottomSheet: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const { dialog } = await openWithKey(canvas, 'Karim Baig', ' ');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus());
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().bottom)).toBe(window.innerHeight));
    await expect(Math.round(dialog.getBoundingClientRect().width)).toBe(window.innerWidth);
    const portrait = within(dialog).getByRole('img', { name: 'Karim Baig, lead guide' }).getBoundingClientRect();
    await expect(portrait.width / portrait.height).toBeCloseTo(4 / 3, 1);
    // The header fits the name, the counter, previous, next and Close.
    const close = within(dialog).getByRole('button', { name: 'Close' }).getBoundingClientRect();
    await expect(close.right).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const OpensBottomSheetOnLight: Story = { ...OpensBottomSheet, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * Next and previous swap the guide in the open sheet: the name, the counter and the rows change,
 * the new guide is announced, and they wrap at both ends. The card highlight follows.
 */
export const PreviousAndNext: Story = {
  play: async ({ canvas, userEvent }) => {
    const { dialog } = await openWithKey(canvas, 'Karim Baig');
    const status = dialog.querySelector('[aria-live="polite"]')!;
    await expect(status).toHaveTextContent('');
    await expect(counter(dialog, '1 of 6')).toBeVisible();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Previous profile' }));
    await expect(dialog).toHaveAccessibleName('Imran Khattak');
    await expect(counter(dialog, '6 of 6')).toBeVisible();
    await expect(rows(dialog)[0]).toBe('Home valley: Mingora, Swat');
    await expect(status).toHaveTextContent('Imran Khattak, 6 of 6');

    await userEvent.click(within(dialog).getByRole('button', { name: 'Next profile' }));
    await expect(dialog).toHaveAccessibleName('Karim Baig');
    await expect(status).toHaveTextContent('Karim Baig, 1 of 6');

    await userEvent.click(within(dialog).getByRole('button', { name: 'Next profile' }));
    await expect(dialog).toHaveAccessibleName('Ghulam Nabi');
    await expect(counter(dialog, '2 of 6')).toBeVisible();
    await expect(rows(dialog)[1]).toBe('With us: Since 2014');
    const shown = canvas.getByRole('button', { name: cardName('Ghulam Nabi'), hidden: true });
    const opened = canvas.getByRole('button', { name: cardName('Karim Baig'), hidden: true });
    await expect(getComputedStyle(shown).backgroundColor).not.toBe(getComputedStyle(opened).backgroundColor);
  },
};

export const PreviousAndNextOnLight: Story = { ...PreviousAndNext, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Escape closes it, and focus returns to the card that opened it, even after moving to other guides. */
export const EscapeReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    const { card, dialog } = await openWithKey(canvas, 'Sana Qureshi');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next profile' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next profile' }));
    await expect(dialog).toHaveAccessibleName('Karim Baig');
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(card).toHaveFocus();
  },
};

/** Close closes it and returns focus to the card that opened it, after moving to another guide. */
export const CloseButton: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, userEvent }) => {
    const { card, dialog } = await openWithKey(canvas, 'Ghulam Nabi');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Previous profile' }));
    await expect(dialog).toHaveAccessibleName('Karim Baig');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(card).toHaveFocus();
  },
};

/** A tap on the backdrop closes it, and focus returns to the card that opened it, after moving to another guide. */
export const Backdrop: Story = {
  play: async ({ canvas, userEvent }) => {
    const { card, dialog } = await openWithKey(canvas, 'Imran Khattak');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next profile' }));
    await expect(dialog).toHaveAccessibleName('Karim Baig');
    await userEvent.click(dialog);
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(card).toHaveFocus();
  },
};

/** M4: cards below the fold rise once into place; only the photo fades. */
export const RisesIntoView: Story = {
  decorators: [roomAbove],
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const cell = canvas.getAllByRole('listitem')[0];
    await waitFor(() => expect(cell).toHaveAttribute('data-rise', 'below'));
    // The portrait is hidden from screen readers (the card's words name the guide), so it's found by its role attribute.
    await expect(opacityUpTo(cell.querySelector('[role="img"]')!, cell)).toBe(0);
    await expect(opacityUpTo(within(cell).getByText('Karim Baig'), cell)).toBe(1);
    cell.scrollIntoView({ block: 'center' });
    await waitFor(() => expect(cell).toHaveAttribute('data-rise', 'in'));
    await waitFor(() => expect(getComputedStyle(cell).transform).toBe('none'), { timeout: 3000 });
    // Once only: scrolled away and back, it stays in place.
    window.scrollTo({ top: 0 });
    await new Promise((resolve) => setTimeout(resolve, 200));
    cell.scrollIntoView({ block: 'center' });
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(cell).toHaveAttribute('data-rise', 'in');
    await expect(getComputedStyle(cell).transform).toBe('none');
  },
};

/** With reduced motion no card is offset, even below the fold. */
export const ReducedMotion: Story = {
  decorators: [roomAbove],
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    for (const cell of canvas.getAllByRole('listitem')) await expect(cell).not.toHaveAttribute('data-rise');
  },
};
