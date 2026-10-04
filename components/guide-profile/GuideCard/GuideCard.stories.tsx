import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { sampleGuides } from '../sampleGuides';
import { GuideCard } from './GuideCard';
import styles from '../../ui/stories.module.css';

const karim = sampleGuides[0];
const withPhoto = { ...karim, portrait: { ...samplePhoto, credit: { source: 'owner' as const } } };

const meta = {
  title: 'Guide profile/GuideCard',
  component: GuideCard,
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GuideCard>;

export default meta;
type Story = StoryObj;

/** Until the owner's photo arrives: the placeholder portrait. One link to the profile, named by the guide. */
export const Placeholder: Story = {
  render: () => <GuideCard guide={karim} />,
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
  render: () => <GuideCard guide={withPhoto} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Karim Baig' })).toHaveAttribute('href', '/about#guide-karim-baig');
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

export const PhotoPhone: Story = { ...Photo, globals: { viewport: { value: 'phone' } } };

export const PhotoDesktop: Story = { ...Photo, globals: { viewport: { value: 'desktop' } } };

const onOpen = fn();

/**
 * About: a button that opens the guide's profile, carrying the guide's anchor as its id, with
 * "View profile" underlined. It's named by its own words, the guide's name first; the portrait,
 * which repeats the name, stays out of it.
 */
export const OnAbout: Story = {
  render: () => <GuideCard variant="button" guide={karim} viewLabel="View profile" selected={false} onOpen={onOpen} />,
  play: async ({ canvas, userEvent }) => {
    const card = canvas.getByRole('button');
    await expect(card).toHaveAccessibleName('Karim Baig Lead guide · Hunza View profile');
    await expect(card).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(card).toHaveAttribute('id', 'guide-karim-baig');
    await expect(getComputedStyle(canvas.getByText('View profile')).textDecorationLine).toBe('underline');
    // Its name is plain text: a button can't hold a heading.
    await expect(canvas.queryByRole('heading')).toBeNull();
    onOpen.mockClear();
    await userEvent.click(card);
    await expect(onOpen).toHaveBeenCalledOnce();
  },
};

export const OnAboutOnLight: Story = { ...OnAbout, globals: { surface: 'light' } };

export const OnAboutPhone: Story = { ...OnAbout, globals: { viewport: { value: 'phone' } } };

export const OnAboutPhoneOnLight: Story = { ...OnAbout, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const OnAboutDesktop: Story = { ...OnAbout, globals: { viewport: { value: 'desktop' } } };

export const OnAboutDesktopOnLight: Story = { ...OnAbout, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** While its profile is shown, the card takes the raised surface. */
export const OnAboutSelected: Story = {
  render: () => (
    <div className={styles.row}>
      <GuideCard variant="button" guide={karim} viewLabel="View profile" selected onOpen={onOpen} />
      <GuideCard variant="button" guide={sampleGuides[1]} viewLabel="View profile" selected={false} onOpen={onOpen} />
    </div>
  ),
  play: async ({ canvas }) => {
    const selected = getComputedStyle(canvas.getByRole('button', { name: /^Karim Baig / })).backgroundColor;
    const other = getComputedStyle(canvas.getByRole('button', { name: /^Ghulam Nabi / })).backgroundColor;
    await expect(selected).not.toBe(other);
  },
};

export const OnAboutSelectedOnLight: Story = { ...OnAboutSelected, globals: { surface: 'light' } };
