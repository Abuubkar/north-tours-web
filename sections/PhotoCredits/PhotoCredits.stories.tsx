import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { photoCredits } from '@/lib/utils/credits';
import { PhotoCredits } from './PhotoCredits';

const credits = photoCredits([
  samplePhoto,
  {
    ...samplePhoto,
    src: '/images/hunza/attabad-lake.jpg',
    alt: 'Turquoise Attabad Lake below a sunlit mountain',
    credit: { source: 'unsplash', author: 'A. Photographer', licence: 'Unsplash License', sourceUrl: 'https://unsplash.com/photos/x' },
  },
]);

const meta = {
  title: 'Sections/PhotoCredits',
  component: PhotoCredits,
  args: {
    copy: { headline: 'Photo credits', intro: 'The photos of places on this site are by these photographers.' },
    credits,
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PhotoCredits>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The page's <h1>, then a row per photo: what it shows, author, licence (linked when it's Creative Commons) and source. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Photo credits' })).toBeVisible();
    const [first, second] = canvas.getAllByRole('listitem');
    await expect(first).toHaveTextContent(samplePhoto.alt);
    await expect(within(first).getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by-sa/4.0/',
    );
    await expect(within(first).getByRole('link', { name: 'Wikimedia Commons' })).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Sunset_at_Rackaposhi_Peak.jpg',
    );
    await expect(second).toHaveTextContent('A. Photographer · Unsplash License · Unsplash');
    await expect(within(second).queryByRole('link', { name: 'Unsplash License' })).toBeNull();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
