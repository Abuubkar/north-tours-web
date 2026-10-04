import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { sampleGuides } from '@/components/guide-profile/sampleGuides';
import { sampleProfiles } from '@/components/guide-profile/sampleProfiles';
import { sampleAbout } from '../sampleAbout';
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

/** About (#guides): the headline, the intro at most 520px wide, then every guide as a card that opens their profile. */
export const About: StoryObj = {
  render: () => <GuidesGrid variant="about" copy={sampleAbout.guides} profiles={sampleProfiles} />,
  play: async ({ canvas, canvasElement }) => {
    const section = canvasElement.querySelector('section')!;
    await expect(section).toHaveAttribute('id', 'guides');
    await expect(canvas.getByRole('heading', { level: 2, name: 'The full team of guides and drivers' })).toBeVisible();
    const intro = canvas.getByText(sampleAbout.guides.intro);
    await expect(intro.getBoundingClientRect().width).toBeLessThanOrEqual(520);
    await expect(canvas.getAllByRole('button', { name: /./ })).toHaveLength(6);
    await expect(canvas.getByRole('button', { name: /^Sana Qureshi / })).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(columns(canvas)).toBe(4);
  },
};

export const AboutOnLight: StoryObj = { ...About, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const AboutPhone: StoryObj = {
  ...About,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(columns(canvas)).toBe(2);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const AboutPhoneOnLight: StoryObj = { ...AboutPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };
