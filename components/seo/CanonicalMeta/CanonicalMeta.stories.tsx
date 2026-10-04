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

/** Both tags go in <head>, with the URL from the URL rule (unit-tested in lib/utils/siteUrl). */
export const Default: Story = {
  play: async () => {
    await waitFor(() => expect(canonical()).toBe('/tours'));
    await expect(ogUrl()).toBe('/tours');
  },
};
