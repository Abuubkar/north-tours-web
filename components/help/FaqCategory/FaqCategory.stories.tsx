import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { sampleHelpCategories, sampleHelpCopy } from '@/sections/sampleHelp';
import { FaqCategory } from './FaqCategory';

const cancellations = sampleHelpCategories[1];

const meta = {
  title: 'Help/FaqCategory',
  component: FaqCategory,
  args: { ...cancellations, linkLabel: sampleHelpCopy.linkToAnswer, group: 'help-faqs' },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof FaqCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

const details = (canvas: ReturnType<typeof within>, question: string) => canvas.getByText(question).closest('details')!;

/**
 * The category's name is an <h2> carrying its anchor; no answer is open; each answer carries its
 * own anchor. Enter opens one, Space on another opens it and closes the first (real keys).
 */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Cancellations & changes' })).toHaveAttribute('id', 'cat-cancellations');
    const all = [...canvasElement.querySelectorAll('details')];
    await expect(all.map((d) => d.id)).toEqual(cancellations.questions.map((q) => q.id));
    for (const item of all) await expect(item.open).toBe(false);

    const keys = await realUser();
    if (!keys) return;
    const [first, second] = cancellations.questions;
    details(canvas, first.question).querySelector('summary')!.focus();
    await keys.keyboard('{Enter}');
    await expect(details(canvas, first.question).open).toBe(true);
    details(canvas, second.question).querySelector('summary')!.focus();
    await keys.keyboard(' ');
    await expect(details(canvas, second.question).open).toBe(true);
    await expect(details(canvas, first.question).open).toBe(false);
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** Each answer ends with "Link to this answer · /help#refunds", a link to it, in Geist rather than Geist Mono. */
export const AnswerLink: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Link to this answer · /help#refunds' });
    await expect(link).toHaveAttribute('href', '/help#refunds');
    await expect(getComputedStyle(link).fontFamily).not.toMatch(/mono/i);
    await expect(getComputedStyle(link).fontFamily).toBe(getComputedStyle(document.body).fontFamily);
  },
};

/** Open, on the light page and on dark (axe checks the answer and its link). */
export const OpenOnLight: Story = {
  play: async ({ canvas }) => {
    details(canvas, cancellations.questions[0].question).open = true;
    await expect(canvas.getByRole('link', { name: 'Link to this answer · /help#refunds' })).toBeVisible();
  },
};

export const OpenOnDark: Story = { ...OpenOnLight, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  ...Desktop,
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};
