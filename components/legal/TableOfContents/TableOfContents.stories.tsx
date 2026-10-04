import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { sampleLegalLabels, sampleLegalSections } from '@/sections/sampleLegal';
import { TableOfContents } from './TableOfContents';

const meta = {
  title: 'Legal/TableOfContents',
  component: TableOfContents,
  args: { ...sampleLegalLabels, sections: sampleLegalSections },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 820px: one nav, "Contents", with a numbered link to each of the nine sections. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Contents' });
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => link.getAttribute('href'))).toEqual(sampleLegalSections.map(({ id }) => `#${id}`));
    await expect(links[0]).toHaveAccessibleName('1 Bookings and payment');
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** Below 820px: one nav holding the "Contents (9)" disclosure, closed; Enter opens it on the nine links. */
export const Phone: Story = {
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1);
    const summary = canvasElement.querySelector('summary')!;
    await expect(summary).toHaveTextContent('Contents (9)');
    await expect(summary.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    const details = summary.closest('details')!;
    await expect(details.open).toBe(false);
    const keys = await realUser();
    if (!keys) return;
    summary.focus();
    await keys.keyboard('{Enter}');
    await expect(details.open).toBe(true);
    await expect(within(details).getAllByRole('link')).toHaveLength(9);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnDark: Story = { ...Phone, globals: { surface: 'dark', viewport: { value: 'phone' } } };
