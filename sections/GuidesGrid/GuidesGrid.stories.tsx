import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleGuides } from '@/components/guide-profile/sampleGuides';
import { sampleHome } from '../sampleHome';
import { GuidesGrid } from './GuidesGrid';

const meta = {
  title: 'Sections/GuidesGrid',
  component: GuidesGrid,
  args: { copy: sampleHome.guides, guides: sampleGuides },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof GuidesGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = (canvas: ReturnType<typeof within>) => gridColumns(canvas.getAllByRole('listitem'));

/** Four across at 1440; each card links to the guide's profile. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Meet the guides and drivers' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Sana Qureshi' })).toHaveAttribute('href', '/about#guide-sana-qureshi');
    await expect(columns(canvas)).toBe(4);
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
