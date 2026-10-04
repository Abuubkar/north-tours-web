import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { samplePolicies, sampleHelpCopy } from '../sampleHelp';
import { Policies } from './Policies';

const meta = {
  title: 'Sections/Policies',
  component: Policies,
  args: { copy: sampleHelpCopy.policies, updated: sampleHelpCopy.policiesUpdated, policies: samplePolicies },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof Policies>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * #policies: the <h2> with "Last updated" in a <time>, then six cards, each title an <h3>, two to
 * a row; the refund table's rows match the settings schedule.
 */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toHaveAttribute('id', 'policies');
    await expect(canvas.getByRole('heading', { level: 2, name: 'Our booking policies, in plain words' })).toBeVisible();
    await expect(canvasElement.querySelector('time')).toHaveAttribute('datetime', sampleHelpCopy.policiesUpdated);
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(samplePolicies.map((p) => p.title));
    const rows = within(canvas.getByRole('table'))
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.textContent);
    await expect(rows).toEqual(['14 or more days100%', '7–13 days50%', 'Under 7 daysNone']);
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(2);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390: one to a row, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(gridColumns(canvas.getAllByRole('listitem'))).toBe(1);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
