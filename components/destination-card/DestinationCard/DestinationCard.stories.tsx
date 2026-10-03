import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinations } from '../sampleDestinations';
import { DestinationCard } from './DestinationCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Destination card/DestinationCard',
  component: DestinationCard,
  args: { destination: sampleDestinations[0], seasonLabel: 'Best season' },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DestinationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One link to the destination's page, named by the destination; the season describes it. */
export const Photo: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Hunza' });
    await expect(link).toHaveAttribute('href', '/destinations/hunza');
    await expect(link).toHaveAccessibleDescription('Best season April – October');
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};

export const PhotoOnLight: Story = { ...Photo, globals: { surface: 'light' } };

export const PhotoPhone: Story = { ...Photo, globals: { viewport: { value: 'phone' } } };

export const PhotoDesktop: Story = { ...Photo, globals: { viewport: { value: 'desktop' } } };

/** Until the photo exists, the striped placeholder names the shot. */
export const Placeholder: Story = {
  args: { destination: sampleDestinations[5] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Murree' })).toHaveAttribute('href', '/destinations/murree');
    await expect(canvas.getByRole('img', { name: 'Pine ridges in mist' })).toBeVisible();
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light' } };
