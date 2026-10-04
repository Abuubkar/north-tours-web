import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { atQuery } from '../../../.storybook/storyUrl';
import { placeholderSettings } from '../../layout/sampleSettings';
import { sampleOptionLabels, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { TourResults } from '../TourResults/TourResults';
import { MobileFilterBar } from './MobileFilterBar';

const meta = {
  title: 'Filters/MobileFilterBar',
  component: MobileFilterBar,
  args: { copy: sampleToursCopy, labels: sampleOptionLabels },
  decorators: [withTourFilters()],
  // Each story starts at plain /tours (a story's own query follows), and the URL is put back after.
  beforeEach: atQuery(''),
  // The bar over the results it filters, as on the page.
  render: (args) => (
    <>
      <MobileFilterBar {...args} />
      <TourResults copy={sampleToursCopy} labels={sampleOptionLabels} settings={placeholderSettings} />
    </>
  ),
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof MobileFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

const filtersButton = (canvas: Canvas) => canvas.getByRole('button', { name: /^Filters/ });
const sortButton = (canvas: Canvas) => canvas.getByRole('button', { name: 'Sort' });
const titles = (canvas: Canvas) => canvas.queryAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);
const scrollTo = (y: number) => window.scrollTo({ top: y, behavior: 'instant' });
const barOf = (canvas: Canvas) => filtersButton(canvas).closest('[data-surface]')!;

/** The count, "Filters" and "Sort". */
export const Phone: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('8 trips', { selector: 'p' })).toBeVisible();
    await expect(filtersButton(canvas)).toHaveAccessibleName('Filters');
    await expect(sortButton(canvas)).toHaveAttribute('aria-expanded', 'false');
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Hunza + Family: "Filters (2)", "2 trips", and the chips above the results. */
export const Filtered: Story = {
  beforeEach: atQuery('?dest=hunza&type=family'),
  play: async ({ canvas }) => {
    await expect(filtersButton(canvas)).toHaveAccessibleName('Filters (2)');
    await expect(canvas.getByText('2 trips', { selector: 'p' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Remove filter Hunza' })).toBeVisible();
  },
};

export const FilteredOnLight: Story = { ...Filtered, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Murree + 8+ days: "0 trips" and the empty state. */
export const Empty: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('0 trips', { selector: 'p' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
  },
};

/**
 * "Filters" opens a sheet named "Filters". Each tap applies at once: after Hunza and Family the
 * button reads "Show 2 trips" and the URL has both. "Show 2 trips" closes it, back on "Filters".
 */
export const FilterSheetOpen: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.click(filtersButton(canvas));
    const sheet = await canvas.findByRole('dialog', { name: 'Filters' });
    await user.click(within(sheet).getByRole('button', { name: 'Hunza, 2 trips' }));
    await user.click(within(sheet).getByRole('button', { name: 'Family, 2 trips' }));
    const show = within(sheet).getByRole('button', { name: 'Show 2 trips' });
    await expect(window.location.search).toBe('?dest=hunza&type=family');
    await expect(titles(canvas)).toEqual(['Hunza & Skardu Grand', 'Hunza Express']);
    await user.click(show);
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(filtersButton(canvas)).toHaveFocus();
    await expect(filtersButton(canvas)).toHaveAccessibleName('Filters (2)');
  },
};

/** Open, for axe on both surfaces. */
export const FilterSheetShown: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(filtersButton(canvas));
    await expect(await canvas.findByRole('dialog', { name: 'Filters' })).toBeVisible();
  },
};

export const FilterSheetShownOnLight: Story = { ...FilterSheetShown, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With nothing matching the button reads "No trips match": not disabled, and it still closes the sheet. */
export const NoTripsMatch: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.click(filtersButton(canvas));
    const sheet = await canvas.findByRole('dialog', { name: 'Filters' });
    const button = within(sheet).getByRole('button', { name: 'No trips match' });
    await expect(button).toBeEnabled();
    await expect(button).not.toHaveAttribute('aria-disabled');
    await user.click(button);
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(filtersButton(canvas)).toHaveFocus();
  },
};

/** Escape (a real key press) closes the sheet and returns focus to "Filters". */
export const Escape: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.click(filtersButton(canvas));
    await canvas.findByRole('dialog', { name: 'Filters' });
    await user.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(filtersButton(canvas)).toHaveFocus();
  },
};

/** The sheet's Close button closes it and returns focus to "Filters" too. */
export const CloseButton: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.click(filtersButton(canvas));
    const sheet = await canvas.findByRole('dialog', { name: 'Filters' });
    await user.click(within(sheet).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(filtersButton(canvas)).toHaveFocus();
  },
};

/** "Sort" opens "Sort by"; picking "Shortest first" closes it, sorts the cards, writes the sort and returns to "Sort". */
export const SortSheetPick: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.click(sortButton(canvas));
    const sheet = await canvas.findByRole('dialog', { name: 'Sort by' });
    await user.click(within(sheet).getByRole('button', { name: 'Shortest first' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(sortButton(canvas)).toHaveFocus();
    await expect(window.location.search).toBe('?sort=shortest');
    await expect(titles(canvas)[0]).toBe('Murree & Galiyat Weekend');
  },
};

/** Open, for axe on both surfaces. */
export const SortSheetShown: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(sortButton(canvas));
    await expect(await canvas.findByRole('dialog', { name: 'Sort by' })).toBeVisible();
  },
};

export const SortSheetShownOnLight: Story = { ...SortSheetShown, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The chips above the results remove their filters; removing the last moves focus to "Filters". */
export const RemoveChips: Story = {
  beforeEach: atQuery('?dest=hunza&type=family'),
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    canvas.getByRole('button', { name: 'Remove filter Hunza' }).focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove filter Family' })).toHaveFocus());
    await user.keyboard('{Enter}');
    await waitFor(() => expect(filtersButton(canvas)).toHaveFocus());
    await expect(window.location.search).toBe('');
  },
};

/** "Clear all filters" in the empty state sends focus to "Filters" below 820px. */
export const ClearFromEmpty: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear all filters' }));
    await expect(filtersButton(canvas)).toHaveFocus();
  },
};

/** Scrolling down stays put until past 320px, then hides the bar; scrolling up brings it back. */
export const HidesOnScroll: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    scrollTo(100);
    scrollTo(300);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await expect(getComputedStyle(barOf(canvas)).transform).toBe('none');
    scrollTo(800);
    await waitFor(() => expect(getComputedStyle(barOf(canvas)).transform).not.toBe('none'));
    scrollTo(500);
    await waitFor(() => expect(getComputedStyle(barOf(canvas)).transform).toBe('none'));
    scrollTo(0);
  },
};

/** With reduced motion the bar moves without a transition. */
export const ReducedMotion: Story = {
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => {
    await expect(getComputedStyle(barOf(canvas)).transitionDuration).toBe('0s');
  },
};

/** From 820px the mobile bar is gone (the desktop bar takes over). */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: /^Filters/ })).toBeNull();
  },
};
