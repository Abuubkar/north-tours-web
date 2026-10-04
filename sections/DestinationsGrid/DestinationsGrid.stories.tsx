import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleDestinations } from '@/components/destination-card/sampleDestinations';
import { sampleHome } from '../sampleHome';
import { DestinationsGrid } from './DestinationsGrid';

const meta = {
  title: 'Sections/DestinationsGrid',
  component: DestinationsGrid,
  args: { copy: sampleHome.destinations, destinations: sampleDestinations },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof DestinationsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = (canvas: ReturnType<typeof within>) => gridColumns(canvas.getAllByRole('listitem'));

/** Six across at 1440; each card links to its destination, and photos load lazily. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Where we go, and when to go there' })).toBeVisible();
    await expect(canvas.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      sampleDestinations.map((d) => `/destinations/${d.slug}`),
    );
    await expect(columns(canvas)).toBe(6);
    for (const img of canvas.getAllByRole('img').filter((i) => i.tagName === 'IMG')) await expect(img).toHaveAttribute('loading', 'lazy');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(columns(canvas)).toBe(2);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
