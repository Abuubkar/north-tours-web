import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion.types';

const questions = [
  { id: 'packing', summary: 'What should I pack?' },
  { id: 'altitude', summary: 'Will the altitude affect me?' },
  { id: 'children', summary: 'Can we travel with children?' },
];

const faqs: AccordionItem[] = [
  {
    id: 'packing',
    summary: 'What should I pack?',
    content:
      'Layers. Mornings and nights are cold even in summer, and Deosai can be near freezing. We send a full packing list on WhatsApp after you book.',
    defaultOpen: true,
  },
  {
    id: 'altitude',
    summary: 'Will the altitude affect me?',
    content:
      'Most travellers feel fine. Karimabad sits at about 2,400 m; take the first evening slowly and drink plenty of water.',
  },
  {
    id: 'children',
    summary: 'Can we travel with children?',
    content: 'Yes. Children under 5 travel free when sharing a room with their parents.',
  },
];

const meta = {
  title: 'Base/Accordion',
  component: Accordion,
  args: { items: faqs, marker: 'plus', name: 'faqs' },
  argTypes: { marker: { control: 'inline-radio', options: ['plus', 'caret'] } },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Faqs: Story = {};

export const FaqsOnLight: Story = { globals: { surface: 'light' } };

/** A single caret item, e.g. "Read the full policy". */
export const Caret: Story = {
  args: {
    marker: 'caret',
    name: undefined,
    items: [
      {
        id: 'refunds',
        summary: 'Read the full policy',
        content: 'Cancel 30 or more days before departure for a full refund of your advance.',
      },
    ],
  },
};

/** Opening one item in a group closes the one that was open. */
export const OneOpenAtATime: Story = {
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByText('What should I pack?').closest('details');
    const second = canvas.getByText('Will the altitude affect me?').closest('details');
    await expect(first).toHaveAttribute('open');
    await userEvent.click(canvas.getByText('Will the altitude affect me?'));
    await expect(second).toHaveAttribute('open');
    await expect(first).not.toHaveAttribute('open');
  },
};

/**
 * Every question is reached with Tab, and Enter and Space toggle it. Synthetic key events
 * can't trigger <summary>'s built-in toggle, so under `pnpm test` the keys are pressed for real
 * through Vitest's browser driver; the Storybook UI, which has no driver, checks Tab only.
 */
export const Keyboard: Story = {
  args: { items: faqs.map((item) => ({ ...item, defaultOpen: false })) },
  play: async ({ canvas, userEvent }) => {
    for (const { summary } of questions) {
      await userEvent.tab();
      await expect(canvas.getByText(summary).closest('summary')).toHaveFocus();
    }

    const realKeys = await realUser();
    if (!realKeys) return;

    const details = canvas.getByText('Can we travel with children?').closest('details');
    await realKeys.keyboard('{Enter}');
    await expect(details).toHaveAttribute('open');
    await realKeys.keyboard(' ');
    await expect(details).not.toHaveAttribute('open');
  },
};

/** A closed item's answer is still in the page, for search engines and find-in-page. */
export const ClosedContentInPage: Story = {
  play: async ({ canvas }) => {
    const answer = canvas.getByText(/Children under 5 travel free/);
    await expect(answer).toBeInTheDocument();
    await expect(answer.closest('details')).not.toHaveAttribute('open');
  },
};


/** The caret marker, open, on the light surface. */
export const CaretOpenOnLight: Story = {
  args: {
    marker: 'caret',
    name: undefined,
    items: [
      {
        id: 'refunds',
        summary: 'Read the full policy',
        content: 'Cancel 30 or more days before departure for a full refund of your advance.',
        defaultOpen: true,
      },
    ],
  },
  globals: { surface: 'light' },
};

/** Compact: one 52px row at 15/500 with a caret and no lines; Enter opens and closes it (the planner's summary bar). */
export const Compact: Story = {
  args: {
    size: 'compact',
    marker: 'caret',
    items: [{ id: 'trip', summary: 'Hunza · Jun · 4 people', content: <p>Destinations: Hunza</p> }],
  },
  play: async ({ canvasElement }) => {
    const summary = canvasElement.querySelector('summary')!;
    const details = canvasElement.querySelector('details')!;
    await expect(summary.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    await expect(summary).toHaveTextContent('Hunza · Jun · 4 people');
    const user = await realUser();
    if (!user) return;
    summary.focus();
    await user.keyboard('{Enter}');
    await expect(details.open).toBe(true);
    await user.keyboard('{Enter}');
    await expect(details.open).toBe(false);
  },
};

export const CompactOnLight: Story = { ...Compact, globals: { surface: 'light' } };

/**
 * Opened by the page: an item's `open` opens it, and `onToggle` reports every change, from the
 * visitor or from the group closing an item (Help's answer links).
 */
export const OpenedByPage: Story = {
  args: {
    items: faqs.map((item) => ({ ...item, defaultOpen: undefined, open: item.id === 'altitude' })),
    onToggle: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const altitude = canvas.getByText('Will the altitude affect me?').closest('details')!;
    await expect(altitude).toHaveAttribute('open');
    await userEvent.click(canvas.getByText('Can we travel with children?'));
    await expect(args.onToggle).toHaveBeenCalledWith('children', true);
    await expect(args.onToggle).toHaveBeenCalledWith('altitude', false);
  },
};

/** An item's anchor is its id, so a link (/help#refunds) reaches it. */
export const Anchors: Story = {
  args: { items: faqs.map((item) => ({ ...item, anchor: item.id })) },
  play: async ({ canvasElement }) => {
    await expect([...canvasElement.querySelectorAll('details')].map((d) => d.id)).toEqual(['packing', 'altitude', 'children']);
  },
};

/**
 * Link: one item whose summary looks like a text link with the caret after it, at least 44px
 * tall; it reads "Hide the full policy" while open, from the open state alone (real keys).
 */
export const Link: Story = {
  args: {
    size: 'link',
    marker: 'caret',
    name: undefined,
    items: [
      {
        id: 'refunds',
        summary: 'Read the full policy',
        openSummary: 'Hide the full policy',
        content: <p>Cancel 14 or more days before departure for a full refund of your advance.</p>,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const summary = canvasElement.querySelector('summary')!;
    await expect(summary.innerText.trim()).toBe('Read the full policy');
    await expect(summary.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(getComputedStyle(summary.querySelector('span')!).textDecorationLine).toBe('underline');
    const keys = await realUser();
    if (!keys) return;
    summary.focus();
    await keys.keyboard('{Enter}');
    await expect(summary.innerText.trim()).toBe('Hide the full policy');
  },
};

export const LinkOnLight: Story = { ...Link, globals: { surface: 'light' } };
