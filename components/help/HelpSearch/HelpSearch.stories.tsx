import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { atHash } from '../../../.storybook/storyUrl';
import { matchingAnswers, searchTerms } from '@/lib/utils/helpSearch';
import { HelpFaqs } from '@/sections/HelpFaqs/HelpFaqs';
import { sampleHelpCategories, sampleHelpCopy } from '@/sections/sampleHelp';
import { HelpProvider } from '../HelpProvider/HelpProvider';
import { HelpSearch } from './HelpSearch';

const askHref = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Help/HelpSearch',
  component: HelpSearch,
  args: { copy: sampleHelpCopy.search },
  parameters: { fullBleed: true },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  // The search and the answers it filters, as on the page.
  decorators: [
    (Story) => (
      <HelpProvider categories={sampleHelpCategories}>
        <div data-surface="light">
          <Story />
        </div>
        <HelpFaqs copy={sampleHelpCopy} askHref={askHref} />
      </HelpProvider>
    ),
  ],
  // Each story starts with no hash and puts the URL back after.
  beforeEach: atHash(''),
} satisfies Meta<typeof HelpSearch>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

/** The ids of the answers a query should show, worked out by the same rules. */
const expected = (query: string) => [...matchingAnswers(sampleHelpCategories, searchTerms(query))];

const openAnswers = (root: HTMLElement) => [...root.querySelectorAll('details')].filter((d) => d.open).map((d) => d.id);

const shownAnswers = (root: HTMLElement) => [...root.querySelectorAll('details')].map((d) => d.id);

const field = (canvas: Canvas) => canvas.getByRole('searchbox', { name: 'Search questions' });

/** Types into the search with real key presses (synthetic ones in the Storybook UI). */
async function search(canvas: Canvas, text: string, fallback: { type: (element: Element, text: string) => Promise<void> }) {
  const input = field(canvas);
  input.focus();
  const keys = await realUser();
  if (keys) await keys.keyboard(text);
  else await fallback.type(input, text);
  return input;
}

/** The visible category list (the sticky list from 820px, the chips below). */
const nav = (canvas: Canvas) => canvas.getByRole('navigation', { name: 'Help categories' });

/**
 * "refund" shows only the matching answers, open, with the word marked; the other categories go,
 * and the category list counts the matches. The result line settles to "N answers for “refund”".
 */
export const Refund: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await search(canvas, 'refund', userEvent);
    const ids = expected('refund');
    await expect(ids.length).toBeGreaterThan(1);
    await waitFor(() => expect(shownAnswers(canvasElement)).toEqual(ids));
    await expect(openAnswers(canvasElement)).toEqual(ids);
    for (const id of ids) await expect(canvasElement.querySelector(`#${id} mark`)).not.toBeNull();
    const headings = canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    const withMatches = sampleHelpCategories.filter((c) => c.questions.some((q) => ids.includes(q.id)));
    await expect(headings).toEqual(withMatches.map((c) => c.title));
    const links = within(nav(canvas)).getAllByRole('link');
    await expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      withMatches.map((c) => {
        const count = c.questions.filter((q) => ids.includes(q.id)).length;
        return `${c.title}, ${count} ${count === 1 ? 'answer' : 'answers'}`;
      }),
    );
    await waitFor(() => expect(canvas.getByText(`${ids.length} answers for “refund”`)).toHaveAttribute('aria-live', 'polite'));
  },
};

export const RefundOnDark: Story = { ...Refund, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** At 390 the chips follow the search too, and the field and its clear button fit. */
export const RefundPhone: Story = {
  ...Refund,
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async (context) => {
    await Refund.play!(context);
    const clear = context.canvas.getByRole('button', { name: 'Clear search' });
    await expect(clear.getBoundingClientRect().right).toBeLessThanOrEqual(field(context.canvas).getBoundingClientRect().right);
    await expect(context.canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

/** Case and accents don't matter: "REFUND" and "réfund" give the same answers as "refund". */
export const CaseAndAccents: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const ids = expected('refund');
    for (const query of ['REFUND', 'réfund']) {
      const input = await search(canvas, query, userEvent);
      await waitFor(() => expect(shownAnswers(canvasElement)).toEqual(ids));
      await userEvent.clear(input);
    }
  },
};

/** Every word counts: "child price" shows only answers with both words, fewer than "child" alone. */
export const EveryWord: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const both = expected('child price');
    await expect(both.length).toBeLessThan(expected('child').length);
    await search(canvas, 'child price', userEvent);
    await waitFor(() => expect(shownAnswers(canvasElement)).toEqual(both));
  },
};

/** "visa" matches nothing: "No answers for that yet.", with WhatsApp's general message, and the line says so. */
export const NoResults: Story = {
  play: async ({ canvas, userEvent }) => {
    await search(canvas, 'visa', userEvent);
    await expect(await canvas.findByRole('heading', { level: 2, name: 'No answers for that yet.' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Ask on WhatsApp' })).toHaveAttribute('href', askHref);
    await waitFor(() => expect(canvas.getByText('No answers for “visa”')).toBeVisible());
    await expect(canvas.queryByRole('navigation', { name: 'Help categories' })).toBeNull();
  },
};

export const NoResultsOnDark: Story = { ...NoResults, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const NoResultsPhone: Story = { ...NoResults, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * Arriving on /help#refunds, then searching: "Clear search", the empty state's "Clear search"
 * and Escape each clear the search, put focus in the field, close the matches and leave the
 * hash's answer open.
 */
export const ClearKeepsLinkedAnswer: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await waitFor(() => expect(openAnswers(canvasElement)).toEqual(['refunds']));
    const keys = await realUser();
    const clears: [string, () => Promise<void>][] = [
      ['packing', () => userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))],
      ['visa', () => userEvent.click(within(canvas.getByRole('heading', { name: 'No answers for that yet.' }).parentElement!).getByRole('button', { name: 'Clear search' }))],
      ['altitude', async () => (keys ? keys.keyboard('{Escape}') : userEvent.keyboard('{Escape}'))],
    ];
    for (const [query, clear] of clears) {
      const input = await search(canvas, query, userEvent);
      await waitFor(() => expect(openAnswers(canvasElement)).toEqual(expected(query)));
      await clear();
      await waitFor(() => expect(input).toHaveValue(''));
      await expect(input).toHaveFocus();
      await waitFor(() => expect(openAnswers(canvasElement)).toEqual(['refunds']));
      await expect(shownAnswers(canvasElement)).toHaveLength(25);
      await expect(window.location.hash).toBe('#refunds');
    }
  },
};

export const ClearKeepsLinkedAnswerOnDark: Story = { ...ClearKeepsLinkedAnswer, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** Enter doesn't reload the page or clear the search; the clear button is named and at least 44px. */
export const EnterAndClearButton: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull();
    const input = await search(canvas, 'altitude', userEvent);
    const keys = await realUser();
    if (keys) await keys.keyboard('{Enter}');
    await expect(input).toHaveValue('altitude');
    const clear = canvas.getByRole('button', { name: 'Clear search' });
    const box = clear.getBoundingClientRect();
    await expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  },
};

export const EnterAndClearButtonPhone: Story = { ...EnterAndClearButton, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * The address's answer among the matches: "refund" keeps #refunds open beside the other match
 * (the one-open group is lifted), and clearing leaves #refunds open, the others closed.
 */
export const LinkedAnswerAmongMatches: Story = {
  beforeEach: atHash('#refunds'),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await waitFor(() => expect(openAnswers(canvasElement)).toEqual(['refunds']));
    const ids = expected('refund');
    await expect(ids).toContain('refunds');
    await search(canvas, 'refund', userEvent);
    await waitFor(() => expect(openAnswers(canvasElement)).toEqual(ids));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await waitFor(() => expect(openAnswers(canvasElement)).toEqual(['refunds']));
    await expect(window.location.hash).toBe('#refunds');
  },
};

export const LinkedAnswerAmongMatchesOnDark: Story = { ...LinkedAnswerAmongMatches, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** A new search straight after clearing announces only its own count, never the cleared one's. */
export const NoStaleCount: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await search(canvas, 'refund', userEvent);
    const line = canvasElement.querySelector('[aria-live="polite"]')!;
    await waitFor(() => expect(line).toHaveTextContent('answers for “refund”'));
    const seen: string[] = [];
    const observer = new MutationObserver(() => seen.push(line.textContent ?? ''));
    observer.observe(line, { childList: true, characterData: true, subtree: true });
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await search(canvas, 'visa', userEvent);
    await waitFor(() => expect(line).toHaveTextContent('No answers for “visa”'));
    observer.disconnect();
    await expect(seen.filter((text) => text !== '')).toEqual(['No answers for “visa”']);
  },
};
