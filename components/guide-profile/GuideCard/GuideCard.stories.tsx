import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { sampleGuides } from '../sampleGuides';
import { GuideCard } from './GuideCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Guide profile/GuideCard',
  component: GuideCard,
  args: { guide: sampleGuides[0] },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GuideCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Until the owner's photo arrives: the placeholder portrait. One link to the profile, named by the guide. */
export const Placeholder: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Karim Baig' });
    await expect(link).toHaveAttribute('href', '/about#guide-karim-baig');
    await expect(link).toHaveAccessibleDescription('Lead guide · Hunza');
    await expect(canvas.getByRole('heading', { level: 3, name: 'Karim Baig' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Karim Baig, lead guide' })).toBeVisible();
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };

export const PlaceholderPhone: Story = { ...Placeholder, globals: { viewport: { value: 'phone' } } };

export const PlaceholderDesktop: Story = { ...Placeholder, globals: { viewport: { value: 'desktop' } } };

/** With an owner-supplied photo (a place photo stands in here; no stock photos of people, ADR-0009). */
export const Photo: Story = {
  args: { guide: { ...sampleGuides[0], portrait: { ...samplePhoto, credit: { source: 'owner' } } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Karim Baig' })).toHaveAttribute('href', '/about#guide-karim-baig');
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

export const PhotoPhone: Story = { ...Photo, globals: { viewport: { value: 'phone' } } };

export const PhotoDesktop: Story = { ...Photo, globals: { viewport: { value: 'desktop' } } };
