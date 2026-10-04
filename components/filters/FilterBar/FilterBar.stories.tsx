import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { realUser } from '../../../.storybook/realUser';
import { atQuery } from '../../../.storybook/storyUrl';
import { placeholderSettings } from '../../layout/sampleSettings';
import { Button } from '../../ui/Button/Button';
import { sampleOptionLabels, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { TourResults } from '../TourResults/TourResults';
import { FilterBar } from './FilterBar';

const meta = {
  title: 'Filters/FilterBar',
  component: FilterBar,
  args: { copy: sampleToursCopy, labels: sampleOptionLabels },
  decorators: [withTourFilters()],
  // Each story starts at plain /tours (a story's own query follows), and the URL is put back after.
  beforeEach: [emulateReducedMotion, atQuery('')],
  // The bar over the results it filters, as on the page.
  render: (args) => (
    <>
      <FilterBar {...args} />
      <TourResults copy={sampleToursCopy} settings={placeholderSettings} />
    </>
  ),
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

const bar = (canvas: Canvas) => canvas.getByRole('region', { name: 'Filter trips' });
const trigger = (canvas: Canvas, name: RegExp) => within(bar(canvas)).getByRole('button', { name });
const titles = (canvas: Canvas) => canvas.queryAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

/** The five filters and the sort, named for screen readers. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    for (const name of [/^Destination/, /^Duration/, /^Budget/, /^Trip type/, /^Month/, /^Sort: Soonest departure/]) {
      await expect(trigger(canvas, name)).toHaveAttribute('aria-expanded', 'false');
    }
    await expect(within(bar(canvas)).queryByRole('button', { name: 'Clear all' })).toBeNull();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** Hunza + Family from a link: both chips, "Destination (1)" and "Trip type (1)", two cards. */
export const Filtered: Story = {
  beforeEach: atQuery('?dest=hunza&type=family'),
  play: async ({ canvas }) => {
    await expect(trigger(canvas, /^Destination \(1\)/)).toBeVisible();
    await expect(trigger(canvas, /^Trip type \(1\)/)).toBeVisible();
    await expect(within(bar(canvas)).getByRole('button', { name: 'Remove filter Hunza' })).toBeVisible();
    await expect(within(bar(canvas)).getByRole('button', { name: 'Remove filter Family' })).toBeVisible();
    await expect(titles(canvas)).toEqual(['Hunza & Skardu Grand', 'Hunza Express']);
  },
};

export const FilteredOnLight: Story = { ...Filtered, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const FilteredLaptop: Story = { ...Filtered, globals: { viewport: { value: 'laptop' } } };

/** Murree + 8+ days matches nothing: the chips stay, and the empty state shows below. */
export const Empty: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    await expect(within(bar(canvas)).getByRole('button', { name: 'Remove filter 8+ days' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
  },
};

export const EmptyLaptop: Story = { ...Empty, globals: { viewport: { value: 'laptop' } } };

/** Destination open, so the panel is checked by axe on both surfaces. */
export const DestinationOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(trigger(canvas, /^Destination/));
    await expect(within(bar(canvas)).getByRole('button', { name: 'Hunza, 2 trips' })).toBeVisible();
  },
};

export const DestinationOpenOnLight: Story = { ...DestinationOpen, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/**
 * Real keys: Enter opens Destination; Space on "Hunza" presses it, the trigger reads "(1)", the
 * panel stays open and the URL gains dest=hunza. Escape closes it and focus is back on the trigger.
 */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const destination = trigger(canvas, /^Destination/);
    destination.focus();
    await user.keyboard('{Enter}');
    await expect(destination).toHaveAttribute('aria-expanded', 'true');
    const hunza = within(bar(canvas)).getByRole('button', { name: 'Hunza, 2 trips' });
    hunza.focus();
    await user.keyboard(' ');
    await expect(hunza).toHaveAttribute('aria-pressed', 'true');
    await expect(trigger(canvas, /^Destination \(1\)/)).toHaveAttribute('aria-expanded', 'true');
    await expect(hunza).toBeVisible();
    await expect(window.location.search).toBe('?dest=hunza');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(destination).toHaveAttribute('aria-expanded', 'false'));
    await expect(destination).toHaveFocus();
  },
};

/** Each row is named with its count, and the counts follow the other groups (faceted). */
export const FacetedCounts: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(trigger(canvas, /^Destination/));
    await expect(within(bar(canvas)).getByRole('button', { name: 'Skardu, 2 trips' })).toBeVisible();
    await expect(within(bar(canvas)).getByRole('button', { name: 'Fairy Meadows, 1 trip' })).toBeVisible();
    await userEvent.click(trigger(canvas, /^Trip type/));
    await expect(trigger(canvas, /^Destination/)).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(within(bar(canvas)).getByRole('button', { name: /^Family, / }));
    await userEvent.click(trigger(canvas, /^Destination/));
    await expect(within(bar(canvas)).getByRole('button', { name: 'Skardu, 1 trip' })).toBeVisible();
    await expect(within(bar(canvas)).getByRole('button', { name: 'Fairy Meadows, 0 trips' })).toBeVisible();
  },
};

/** Month takes one: June then July leaves only July, and July again clears it. */
export const Month: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(trigger(canvas, /^Month/));
    const panel = within(bar(canvas));
    await userEvent.click(panel.getByRole('button', { name: /^June 2099, / }));
    await userEvent.click(panel.getByRole('button', { name: /^July 2099, / }));
    await expect(panel.getByRole('button', { name: /^June 2099, / })).toHaveAttribute('aria-pressed', 'false');
    await expect(panel.getByRole('button', { name: /^July 2099, / })).toHaveAttribute('aria-pressed', 'true');
    await expect(window.location.search).toBe('?month=2099-07');
    await userEvent.click(panel.getByRole('button', { name: /^July 2099, / }));
    await expect(panel.getByRole('button', { name: /^July 2099, / })).toHaveAttribute('aria-pressed', 'false');
    await expect(window.location.search).toBe('');
  },
};

/** Picking "Price: high to low" closes the menu, reorders the cards and writes sort=price-desc. */
export const Sort: Story = {
  play: async ({ canvas, userEvent }) => {
    const sort = trigger(canvas, /^Sort:/);
    await userEvent.click(sort);
    await userEvent.click(within(bar(canvas)).getByRole('button', { name: 'Price: high to low' }));
    await waitFor(() => expect(sort).toHaveAttribute('aria-expanded', 'false'));
    await expect(sort).toHaveAccessibleName('Sort: Price: high to low');
    await expect(titles(canvas).slice(0, 3)).toEqual(['Hunza & Skardu Grand', 'Skardu & Deosai', 'Hunza Express']);
    await expect(window.location.search).toBe('?sort=price-desc');
  },
};

/**
 * Removing a chip removes its filter and moves focus to the next chip; removing the last moves it
 * to the results heading.
 */
export const RemoveChips: Story = {
  beforeEach: atQuery('?dest=hunza&type=family'),
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    within(bar(canvas)).getByRole('button', { name: 'Remove filter Hunza' }).focus();
    await user.keyboard('{Enter}');
    const family = within(bar(canvas)).getByRole('button', { name: 'Remove filter Family' });
    await waitFor(() => expect(family).toHaveFocus());
    await expect(window.location.search).toBe('?type=family');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { level: 2, name: '8 trips' })).toHaveFocus());
    await expect(window.location.search).toBe('');
  },
};

/** "Clear all" removes every filter, keeps the sort, and moves focus to the results heading. */
export const ClearAll: Story = {
  beforeEach: atQuery('?dest=hunza,swat&sort=shortest'),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(within(bar(canvas)).getByRole('button', { name: 'Clear all' }));
    await expect(window.location.search).toBe('?sort=shortest');
    await expect(canvas.getByRole('heading', { level: 2, name: '8 trips' })).toHaveFocus();
    await expect(within(bar(canvas)).queryByRole('button', { name: /^Remove filter/ })).toBeNull();
  },
};

/** At 390 the bar is gone (the mobile bar takes over). */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('region', { name: 'Filter trips' })).toBeNull();
    await expect(canvasElement.querySelector('section[aria-label="Filter trips"]')).not.toBeVisible();
  },
};

const scrollTo = (y: number) => window.scrollTo({ top: y, behavior: 'instant' });

/** Scrolling down past 320px hides the bar and closes an open dropdown; scrolling up brings it back. */
export const HidesOnScroll: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const destination = trigger(canvas, /^Destination/);
    await user.click(destination);
    await expect(destination).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(bar(canvas)).transitionDuration).toBe('0.3s');
    scrollTo(100);
    scrollTo(600);
    await waitFor(() => expect(getComputedStyle(bar(canvas)).transform).not.toBe('none'));
    await expect(destination).toHaveAttribute('aria-expanded', 'false');
    scrollTo(400);
    await waitFor(() => expect(getComputedStyle(bar(canvas)).transform).toBe('none'));
    scrollTo(0);
  },
};

/** With reduced motion the bar moves without a transition. */
export const ReducedMotion: Story = {
  play: async ({ canvas }) => {
    await expect(getComputedStyle(bar(canvas)).transitionDuration).toBe('0s');
  },
};

/** Tabbing into the hidden bar shows it, so focus never lands on something out of view. */
export const TabIntoHiddenBar: Story = {
  render: (args) => (
    <>
      <Button variant="secondary">Before the bar</Button>
      <FilterBar {...args} />
      <TourResults copy={sampleToursCopy} settings={placeholderSettings} />
    </>
  ),
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    canvas.getByRole('button', { name: 'Before the bar' }).focus();
    scrollTo(100);
    scrollTo(600);
    await waitFor(() => expect(getComputedStyle(bar(canvas)).transform).not.toBe('none'));
    await user.keyboard('{Tab}');
    await expect(trigger(canvas, /^Destination/)).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(bar(canvas)).transform).toBe('none'));
    scrollTo(0);
  },
};
