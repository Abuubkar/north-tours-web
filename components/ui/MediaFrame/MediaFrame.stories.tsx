import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { samplePhoto, samplePlaceholder } from './samplePhotos';
import { MediaFrame } from './MediaFrame';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/MediaFrame',
  component: MediaFrame,
  args: { image: samplePhoto, ratio: '4:3', sizes: '460px' },
  argTypes: {
    ratio: { control: 'inline-radio', options: ['fill', '4:3', '3:4', '4:5', '16:10'] },
    wideRatio: { control: 'inline-radio', options: [undefined, '4:5'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A photo: AVIF and WebP sources, a JPEG fallback with width and height, loaded lazily. */
export const Photo: Story = {
  play: async ({ canvas, canvasElement }) => {
    const img = canvas.getByRole('img', { name: samplePhoto.alt });
    await expect(img).toHaveAttribute('width', String(samplePhoto.width));
    await expect(img).toHaveAttribute('height', String(samplePhoto.height));
    await expect(img).toHaveAttribute('loading', 'lazy');
    await expect(img).not.toHaveAttribute('fetchpriority');
    const sources = [...canvasElement.querySelectorAll('picture source')];
    await expect(sources.map((s) => s.getAttribute('type'))).toEqual(['image/avif', 'image/webp']);
    for (const source of sources) {
      await expect(source.getAttribute('srcset')).toMatch(/-480\.(avif|webp) 480w, .*-1200\.(avif|webp) 1200w/);
      await expect(source).toHaveAttribute('sizes', '460px');
    }
    await expect(img.getAttribute('srcset')).toMatch(/-480\.jpg 480w/);
    // The browser picked and loaded one of the variants.
    await waitFor(() => expect((img as HTMLImageElement).naturalWidth).toBeGreaterThan(0));
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

/** Portrait frames for destination (3:4) and guide (4:5) cards. */
export const Ratios: Story = {
  render: (args) => (
    <div className={styles.row}>
      <MediaFrame {...args} ratio="3:4" sizes="200px" />
      <MediaFrame {...args} ratio="4:5" image={samplePlaceholder} sizes="200px" />
    </div>
  ),
};

/** The private trip banner's wide frame, 16:10. */
export const Wide: Story = {
  args: { ratio: '16:10', sizes: '460px' },
  play: async ({ canvas }) => {
    const frame = canvas.getByRole('img', { name: samplePhoto.alt }).closest('picture')!.getBoundingClientRect();
    await expect(frame.width / frame.height).toBeCloseTo(1.6, 1);
  },
};

/** A frame that changes shape at 820px, from CSS alone: a guide's profile portrait, 4:5 in the side drawer. */
export const WideFromTablet: Story = {
  args: { ratio: '4:3', wideRatio: '4:5', sizes: '460px' },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const frame = canvas.getByRole('img', { name: samplePhoto.alt }).closest('picture')!.getBoundingClientRect();
    await expect(frame.width / frame.height).toBeCloseTo(4 / 5, 1);
  },
};

/** Below 820px the same frame keeps its 4:3. */
export const WideFromTabletPhone: Story = {
  ...WideFromTablet,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const frame = canvas.getByRole('img', { name: samplePhoto.alt }).closest('picture')!.getBoundingClientRect();
    await expect(frame.width / frame.height).toBeCloseTo(4 / 3, 1);
  },
};

/** The page's main image (the hero): full-bleed, unrounded, loaded straight away with high priority. */
export const Priority: Story = {
  args: { ratio: 'fill', sizes: '100vw', priority: true },
  decorators: [
    (Story) => (
      <div className={styles.fill}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: samplePhoto.alt });
    await expect(img).toHaveAttribute('loading', 'eager');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(getComputedStyle(img.parentElement!).borderRadius).toBe('0px');
  },
};

/** Until the photo exists: the striped frame names the shot, and is read as an image by its alt. */
export const Placeholder: Story = {
  args: { image: samplePlaceholder },
  play: async ({ canvas }) => {
    const frame = canvas.getByRole('img', { name: samplePlaceholder.alt });
    await expect(frame).toHaveTextContent(samplePlaceholder.placeholder);
    await expect(getComputedStyle(frame).borderRadius).toBe('8px');
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };
