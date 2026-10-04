import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleAbout } from '@/sections/sampleAbout';
import { VehicleCard } from './VehicleCard';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'About/VehicleCard',
  component: VehicleCard,
  args: { vehicle: sampleAbout.vehicles.items[0] },
  decorators: [
    (Story) => (
      <ul className={styles.card}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof VehicleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A list item: the photo named by its alt, the name as an <h3>, then what it's for. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem')).toBeVisible();
    await expect(canvas.getByRole('img', { name: sampleAbout.vehicles.items[0].image.alt })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Toyota Coaster' })).toBeVisible();
    await expect(canvas.getByText('22 seats · air-conditioned · group departures')).toBeVisible();
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
