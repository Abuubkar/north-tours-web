import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { WaysToReachUs } from './WaysToReachUs';
import type { WaysToReachUsProps } from './WaysToReachUs.types';

const chatHref = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const copy: WaysToReachUsProps['copy'] = {
  headline: 'Ways to reach us',
  whatsapp: { label: 'WhatsApp · fastest', line: 'Send your dates and group size. We reply within 2 hours.', chatLabel: 'Chat now' },
  phone: { label: 'Phone' },
  email: { label: 'Email', line: 'For invoices, documents and longer questions.' },
};

/** The values as content has them today: placeholders (ADR-0010). */
const placeholders: WaysToReachUsProps['channels'] = {
  whatsapp: { value: '[+92 3XX XXX XXXX]', href: undefined, chatHref },
  phone: { value: '[+92 42 XXXX XXXX]', href: undefined, hours: '[Mon–Sat, X am – X pm]' },
  email: { value: '[hello@brand.pk]', href: undefined },
};

/** Real values, as the owner will supply them. */
const real: WaysToReachUsProps['channels'] = {
  whatsapp: { value: '+92 300 1234567', href: 'https://wa.me/923001234567?text=Hi', chatHref: 'https://wa.me/923001234567?text=Hi' },
  phone: { value: '+92 42 3578 1234', href: 'tel:+924235781234', hours: 'Mon–Sat, 10 am – 7 pm' },
  email: { value: 'hello@example.pk', href: 'mailto:hello@example.pk' },
};

const meta = {
  title: 'Sections/WaysToReachUs',
  component: WaysToReachUs,
  args: { copy, channels: placeholders },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof WaysToReachUs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three channels are <h3>s under the hidden "Ways to reach us" <h2>, side by side from 1100px;
 * with placeholders the values are plain text and "Chat now" has the general message and no number.
 */
export const Placeholders: Story = {
  play: async ({ canvas }) => {
    const h2 = canvas.getByRole('heading', { level: 2, name: 'Ways to reach us' });
    await expect(h2.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['WhatsApp · fastest', 'Phone', 'Email']);
    await expect(canvas.getAllByRole('link').map((a) => a.textContent)).toEqual(['Chat now']);
    await expect(canvas.getByRole('link', { name: 'Chat now' })).toHaveAttribute('href', chatHref);
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(3);
  },
};

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** With real values: the WhatsApp number, phone and email are wa.me, tel: and mailto: links. */
export const RealValues: Story = {
  args: { channels: real },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 300 1234567' })).toHaveAttribute('href', 'https://wa.me/923001234567?text=Hi');
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
    await expect(canvas.getByRole('link', { name: 'hello@example.pk' })).toHaveAttribute('href', 'mailto:hello@example.pk');
  },
};

export const RealValuesOnLight: Story = { ...RealValues, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Below 1100px the channels stack, one column, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(1);
    await expect(within(canvasElement).getByRole('link', { name: 'Chat now' })).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const PhoneReal: Story = { ...Phone, args: { channels: real } };

export const Laptop: Story = { ...Placeholders, globals: { viewport: { value: 'laptop' } } };
