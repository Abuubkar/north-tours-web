import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { hunzaPlaces } from '@/components/places-map/samplePlaces';
import { PlacesToSee } from './PlacesToSee';

const meta = {
  title: 'Sections/PlacesToSee',
  component: PlacesToSee,
  args: { headline: 'What to see in Hunza', places: hunzaPlaces, kinds: sampleDestinationCopy.places.kinds },
  parameters: { fullBleed: true },
} satisfies Meta<typeof PlacesToSee>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2, then the places; the section is the page's #places. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement, args }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'What to see in Hunza' });
    await expect(headline).toBeVisible();
    // Links to /destinations/hunza#places land on the section.
    await expect(canvasElement.querySelector('#places')).toContainElement(headline);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(args.places.length);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
