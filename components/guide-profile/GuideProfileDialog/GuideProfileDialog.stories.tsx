import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { sampleAbout } from '@/sections/sampleAbout';
import { sampleProfiles } from '../sampleProfiles';
import { GuideProfileDialog } from './GuideProfileDialog';

const meta = {
  title: 'Guide profile/GuideProfileDialog',
  component: GuideProfileDialog,
  args: { profiles: sampleProfiles, shown: 0, stepped: false, copy: sampleAbout.guides.profile, onStep: fn(), onClose: fn() },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof GuideProfileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open from 820px: the side drawer, titled with the guide's name, the counter, previous and next beside it. */
export const Drawer: Story = {
  play: async ({ canvas, args }) => {
    const dialog = await canvas.findByRole('dialog', { name: 'Karim Baig' });
    await expect(canvas.getByRole('heading', { level: 2, name: 'Karim Baig' })).toBeVisible();
    await expect(within(dialog).getByText('1 of 6')).toBeVisible();
    await within(dialog).getByRole('button', { name: 'Next profile' }).click();
    await expect(args.onStep).toHaveBeenCalledWith(1);
    await within(dialog).getByRole('button', { name: 'Previous profile' }).click();
    await expect(args.onStep).toHaveBeenCalledWith(-1);
    await expect(within(dialog).getByText('Karim Baig plans each day around the weather and your family’s pace.')).toBeVisible();
  },
};

export const DrawerOnLight: Story = { ...Drawer, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Below 820px: the bottom sheet. */
export const BottomSheet: Story = { ...Drawer, globals: { viewport: { value: 'phone' } } };

export const BottomSheetOnLight: Story = { ...Drawer, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** After previous or next, the new guide is announced politely. */
export const Announced: Story = {
  args: { shown: 2, stepped: true },
  play: async ({ canvas }) => {
    const dialog = await canvas.findByRole('dialog', { name: 'Ali Raza' });
    const status = dialog.querySelector('[aria-live="polite"]');
    await expect(status).toHaveTextContent('Ali Raza, 3 of 6');
  },
};

/** Closed: nothing shows, nothing is announced. */
export const Closed: Story = {
  args: { shown: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};
