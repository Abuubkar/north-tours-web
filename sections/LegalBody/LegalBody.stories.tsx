import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../.storybook/realUser';
import { emulateReducedMotion } from '../../.storybook/reducedMotion';
import { roomBelow } from '../../.storybook/scrollRoom';
import { atHash, followHashLinks } from '../../.storybook/storyUrl';
import { sampleLegalLabels, sampleLegalSections } from '../sampleLegal';
import { LegalBody } from './LegalBody';

const meta = {
  title: 'Sections/LegalBody',
  component: LegalBody,
  args: {
    contents: sampleLegalLabels,
    sections: sampleLegalSections,
    closing: 'Questions about these terms? Email {email}.',
    email: '[hello@brand.pk]',
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
  decorators: [roomBelow],
  // A contents link writes its anchor into the URL; each story starts with none and puts the URL back after.
  beforeEach: [
    async () => {
      await emulateReducedMotion();
    },
    atHash(''),
  ],
} satisfies Meta<typeof LegalBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The header's height: anchors land below it (scroll-padding-top). */
const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);

/**
 * From 820px: the contents beside the text, sticky, linking to all nine sections; each section's
 * heading an <h2> with its number; the email plain text while it's a placeholder.
 */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Contents' });
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    await expect(getComputedStyle(nav).position).toBe('sticky');
    const links = within(nav).getAllByRole('link');
    await expect(links).toHaveLength(9);
    const headings = canvas.getAllByRole('heading', { level: 2 });
    await expect(headings.map((h) => h.textContent)).toEqual(sampleLegalSections.map(({ number, heading }) => `${number}. ${heading}`));
    for (const [i, link] of links.entries()) {
      await expect(document.querySelector(link.getAttribute('href')!)).toBe(headings[i].closest('section'));
    }
    // Beside the text, not above it.
    const article = canvas.getByRole('article');
    await expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(article.getBoundingClientRect().left);
    await expect(canvas.getByText(/^Questions about these terms\?/)).toHaveTextContent('Email [hello@brand.pk].');
    await expect(canvas.queryByRole('link', { name: '[hello@brand.pk]' })).toBeNull();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** With a real email, the closing line links to it. */
export const RealEmail: Story = {
  args: { email: 'hello@example.pk' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'hello@example.pk' })).toHaveAttribute('href', 'mailto:hello@example.pk');
  },
};

/**
 * At 390: "Contents (9)" opens with Enter; a link activated with Enter closes it and lands its
 * section just below the header. Nothing scrolls sideways.
 */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  beforeEach: followHashLinks,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    const keys = await realUser();
    if (!keys) return;
    const summary = canvasElement.querySelector('summary')!;
    const details = summary.closest('details')!;
    summary.focus();
    await keys.keyboard('{Enter}');
    await expect(details.open).toBe(true);
    within(details).getByRole('link', { name: '5 Health and safety' }).focus();
    await keys.keyboard('{Enter}');
    await waitFor(() => expect(window.location.hash).toBe('#health'));
    await expect(details.open).toBe(false);
    const top = document.getElementById('health')!.getBoundingClientRect().top;
    await expect(top).toBeGreaterThanOrEqual(headerHeight() - 1);
    await expect(top).toBeLessThanOrEqual(headerHeight() + 1);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
