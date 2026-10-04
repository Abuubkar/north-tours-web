import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { realUser } from '../../.storybook/realUser';
import { sampleHelpCategories, sampleHelpCopy } from '../sampleHelp';
import { HelpFaqs } from './HelpFaqs';

const meta = {
  title: 'Sections/HelpFaqs',
  component: HelpFaqs,
  args: { copy: sampleHelpCopy, categories: sampleHelpCategories },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
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
