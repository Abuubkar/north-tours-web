import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../.storybook/realUser';
import { atHash } from '../../.storybook/storyUrl';
import { sampleHelpCategories, sampleHelpCopy } from '../sampleHelp';
import { HelpFaqs } from './HelpFaqs';

const meta = {
  title: 'Sections/HelpFaqs',
  component: HelpFaqs,
  args: { copy: sampleHelpCopy, categories: sampleHelpCategories },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
  // Opening an answer writes its anchor into the URL; each story starts with none and puts the URL back after.
  beforeEach: atHash(''),
} satisfies Meta<typeof HelpFaqs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Six categories as <h2>s in order, the category list beside them with counts in the links'
 * names, no answer open. One answer open at a time across categories (real keys).
 */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(sampleHelpCategories.map((c) => c.title));
    const nav = canvas.getByRole('navigation', { name: 'Help categories' });
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    await expect(within(nav).getByRole('link', { name: 'On the trip, 5 answers' })).toHaveAttribute('href', '#cat-on-trip');
    const all = [...canvasElement.querySelectorAll('details')];
    await expect(all).toHaveLength(25);
    for (const item of all) await expect(item.open).toBe(false);

    const keys = await realUser();
    if (!keys) return;
    const refunds = canvasElement.querySelector<HTMLDetailsElement>('#refunds')!;
    const altitude = canvasElement.querySelector<HTMLDetailsElement>('#altitude')!;
    refunds.querySelector('summary')!.focus();
    await keys.keyboard('{Enter}');
    await expect(refunds.open).toBe(true);
    altitude.querySelector('summary')!.focus();
    await keys.keyboard('{Enter}');
    await expect(altitude.open).toBe(true);
    await expect(refunds.open).toBe(false);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390: the chips above the questions, and nothing but the chips scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    const nav = canvas.getByRole('navigation', { name: 'Help categories' });
    await expect(nav.getBoundingClientRect().bottom).toBeLessThanOrEqual(canvas.getAllByRole('heading', { level: 2 })[0].getBoundingClientRect().top);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

const answer = (canvasElement: HTMLElement, id: string) => canvasElement.querySelector<HTMLDetailsElement>(`#${id}`)!;

const openIds = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll('details')].filter((d) => d.open).map((d) => d.id);

/**
 * Arriving on `/help#refunds`: that answer opens after load, every other one closed. (The
 * browser's scroll to it on arrival is checked on the built site: a story's URL changes without
 * a load.)
 */
export const OpensFromLink: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(openIds(canvasElement)).toEqual(['refunds']));
    await expect(window.location.hash).toBe('#refunds');
  },
};

export const OpensFromLinkOnLight: Story = { ...OpensFromLink, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const OpensFromLinkPhone: Story = { ...OpensFromLink, globals: { viewport: { value: 'phone' } } };

/**
 * Opening another answer with Enter writes its link without a history entry and closes the one
 * the link opened; closing it with Enter clears the hash, keeping the path and search.
 */
export const HashFollowsAnswer: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(openIds(canvasElement)).toEqual(['refunds']));
    const keys = await realUser();
    if (!keys) return;
    const entries = window.history.length;
    const { search } = window.location;
    answer(canvasElement, 'altitude').querySelector('summary')!.focus();
    await keys.keyboard('{Enter}');
    await waitFor(() => expect(window.location.hash).toBe('#altitude'));
    await expect(openIds(canvasElement)).toEqual(['altitude']);
    await expect(window.history.length).toBe(entries);
    await keys.keyboard('{Enter}');
    await waitFor(() => expect(window.location.hash).toBe(''));
    await expect(openIds(canvasElement)).toEqual([]);
    await expect(window.location.search).toBe(search);
  },
};

export const HashFollowsAnswerOnLight: Story = { ...HashFollowsAnswer, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** A later hash change to #altitude (a pasted link, the back button) opens it and closes the open one. */
export const HashChangeOpens: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(openIds(canvasElement)).toEqual(['refunds']));
    window.location.hash = '#altitude';
    await waitFor(() => expect(openIds(canvasElement)).toEqual(['altitude']));
  },
};

export const HashChangeOpensOnLight: Story = { ...HashChangeOpens, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** An unknown answer's hash opens nothing, and stays as it is. */
export const UnknownHash: Story = {
  beforeEach: atHash('#visa'),
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(openIds(canvasElement)).toEqual([]);
    await expect(window.location.hash).toBe('#visa');
  },
};

/** "Link to this answer" keeps its answer open and the address on its link, with no new history entry. */
export const LinkKeepsAnswerOpen: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(openIds(canvasElement)).toEqual(['refunds']));
    const entries = window.history.length;
    const link = canvas.getByRole('link', { name: 'Link to this answer · /help#refunds' });
    const keys = await realUser();
    link.focus();
    if (keys) await keys.keyboard('{Enter}');
    else link.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(openIds(canvasElement)).toEqual(['refunds']);
    await expect(window.location.hash).toBe('#refunds');
    await expect(window.history.length).toBe(entries);
  },
};

export const LinkKeepsAnswerOpenOnLight: Story = { ...LinkKeepsAnswerOpen, globals: { surface: 'light', viewport: { value: 'desktop' } } };
