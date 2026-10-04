import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { CanonicalMeta } from './CanonicalMeta';

const meta = {
  title: 'SEO/CanonicalMeta',
  component: CanonicalMeta,
  args: { path: '/tours', siteUrl: '[Site URL]' },
} satisfies Meta<typeof CanonicalMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const ogUrl = () => document.head.querySelector('meta[property="og:url"]')?.getAttribute('content');

/** While the site URL is a placeholder, both are root-relative. The tags go in <head>. */
export const PlaceholderSiteUrl: Story = {
  play: async () => {
    await waitFor(() => expect(canonical()).toBe('/tours'));
    await expect(ogUrl()).toBe('/tours');
  },
};

/** With a real site URL they're absolute. */
export const RealSiteUrl: Story = {
  args: { siteUrl: 'https://example.pk' },
  play: async () => {
    await waitFor(() => expect(canonical()).toBe('https://example.pk/tours'));
    await expect(ogUrl()).toBe('https://example.pk/tours');
  },
};
