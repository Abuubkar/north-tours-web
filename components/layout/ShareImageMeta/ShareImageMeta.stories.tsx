import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { ShareImageMeta } from './ShareImageMeta';

const meta = {
  title: 'Layout/ShareImageMeta',
  component: ShareImageMeta,
  args: { photo: samplePhoto, siteUrl: '[Site URL]' },
} satisfies Meta<typeof ShareImageMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

const share = samplePhoto.src.replace(/\.jpg$/, '-share.jpg');
const meta$ = (selector: string) => document.head.querySelector(selector)?.getAttribute('content');

/** While the site URL is a placeholder, the share image is root-relative. The tags go in <head>. */
export const PlaceholderSiteUrl: Story = {
  play: async () => {
    await waitFor(() => expect(meta$('meta[property="og:image"]')).toBe(share));
    await expect(meta$('meta[name="twitter:image"]')).toBe(share);
    await expect(meta$('meta[property="og:image:width"]')).toBe('1200');
    await expect(meta$('meta[property="og:image:height"]')).toBe('630');
    await expect(meta$('meta[property="og:image:alt"]')).toBe(samplePhoto.alt);
  },
};

/** With a real site URL it's absolute, as Open Graph expects. */
export const RealSiteUrl: Story = {
  args: { siteUrl: 'https://example.pk' },
  play: async () => {
    await waitFor(() => expect(meta$('meta[property="og:image"]')).toBe(`https://example.pk${share}`));
  },
};
