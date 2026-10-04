import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { QuickLinks } from './QuickLinks';

const links = [
  { label: 'Plan a private trip', href: '/plan' },
  { label: 'Browse tours', href: '/tours' },
  { label: 'Help & FAQs', href: '/help' },
  { label: 'Booking policies', href: '/help#policies' },
];

const placeholderSocial = [
  { label: 'Instagram', href: undefined },
  { label: 'Facebook', href: undefined },
  { label: 'YouTube', href: undefined },
];

const realSocial = [
  { label: 'Instagram', href: 'https://instagram.com/example' },
  { label: 'Facebook', href: 'https://facebook.com/example' },
  { label: 'YouTube', href: 'https://youtube.com/@example' },
];

const meta = {
  title: 'Sections/QuickLinks',
  component: QuickLinks,
  args: { label: 'Quick links', links, follow: 'Follow the trips', social: placeholderSocial },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof QuickLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Quick links" is the section's <h2> (in the label's look) and names the nav; its rows go to the
 * planner, the tours, Help and the booking policies, each at least 64px tall. With placeholder
 * profiles the social names are plain text.
 */
export const Placeholders: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Quick links' })).toBeVisible();
    const nav = canvas.getByRole('navigation', { name: 'Quick links' });
    const rows = within(nav).getAllByRole('link');
    await expect(rows.map((a) => [a.textContent?.replace('→', ''), a.getAttribute('href')])).toEqual(links.map((l) => [l.label, l.href]));
    for (const row of rows) await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(64);
    await expect(canvas.getByText('Follow the trips')).toBeVisible();
    for (const name of ['Instagram', 'Facebook', 'YouTube']) {
      await expect(canvas.getByText(name).closest('a')).toBeNull();
    }
  },
};

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const PlaceholdersPhone: Story = {
  ...Placeholders,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Placeholders.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const PlaceholdersPhoneOnLight: Story = { ...PlaceholdersPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With real profiles, the social links are quiet 44px buttons. */
export const RealSocial: Story = {
  args: { social: realSocial },
  play: async ({ canvas }) => {
    for (const { label, href } of realSocial) {
      const link = canvas.getByRole('link', { name: label });
      await expect(link).toHaveAttribute('href', href);
      await expect(link.getBoundingClientRect().height).toBe(44);
    }
  },
};

export const RealSocialOnLight: Story = { ...RealSocial, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RealSocialPhone: Story = { ...RealSocial, globals: { viewport: { value: 'phone' } } };

export const RealSocialPhoneOnLight: Story = { ...RealSocial, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The not-found page's rows (PRD #94): the same section, with its own four links to the main pages. */
const notFoundLinks = [
  { label: 'Plan a private trip', href: '/plan' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About us and our guides', href: '/about' },
  { label: 'Help & FAQs', href: '/help' },
];

export const NotFoundRows: Story = {
  args: { links: notFoundLinks },
  play: async ({ canvas }) => {
    const rows = within(canvas.getByRole('navigation', { name: 'Quick links' })).getAllByRole('link');
    await expect(rows.map((a) => [a.textContent?.replace('→', ''), a.getAttribute('href')])).toEqual(notFoundLinks.map((l) => [l.label, l.href]));
  },
};
