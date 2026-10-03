import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleHome } from '../sampleHome';
import { BrandStatement } from './BrandStatement';

const meta = {
  title: 'Sections/BrandStatement',
  component: BrandStatement,
  args: { copy: sampleHome.statement },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof BrandStatement>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The page's only <h1>, then the body and "Meet the team" to the guides on the About page. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: sampleHome.statement.headline })).toBeVisible();
    await expect(canvas.getAllByRole('heading')).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: 'Meet the team' })).toHaveAttribute('href', '/about#guides');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
