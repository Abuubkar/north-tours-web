import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { samplePlannerCopy, withPlanner } from '../samplePlanner';
import { PhoneField } from './PhoneField';

const meta = {
  title: 'Planner/PhoneField',
  component: PhoneField,
  args: { copy: samplePlannerCopy.details.phone },
  decorators: [withPlanner],
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof PhoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * +92 and the number read as one field: the input is named "WhatsApp number", described by "+92"
 * and the hint, and opens a numeric keypad. Real keys: "0300-123 4567x" keeps digits and spaces.
 */
export const Pakistani: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'WhatsApp number' });
    await expect(input).toHaveAccessibleDescription('+92 Required');
    await expect(input).toHaveAttribute('type', 'tel');
    await expect(input).toHaveAttribute('inputmode', 'numeric');
    await expect(input).toHaveAttribute('autocomplete', 'tel-national');
    await expect(input).toHaveAttribute('placeholder', '3XX XXX XXXX');
    const user = await realUser();
    if (!user) return;
    await user.click(input);
    await user.keyboard('0300-123 4567x');
    await expect(input).toHaveValue('0300123 4567');
  },
};

export const PakistaniPhone: Story = { ...Pakistani, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const PakistaniOnDark: Story = { ...Pakistani, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

/** "Outside Pakistan?" switches to a country code and a number, focusing the code; "Pakistani number?" switches back. */
export const Abroad: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('textbox', { name: 'WhatsApp number' }), '300 123');
    await userEvent.click(canvas.getByRole('button', { name: 'Outside Pakistan?' }));
    const code = canvas.getByRole('textbox', { name: 'Country code' });
    await expect(code).toHaveFocus();
    await expect(canvas.getByRole('group', { name: 'WhatsApp number' })).toBeVisible();
    await expect(code).toHaveAttribute('maxlength', '3');
    await expect(canvas.getByRole('textbox', { name: 'Number' })).toHaveAttribute('autocomplete', 'tel');
    await userEvent.type(code, '44');
    await userEvent.click(canvas.getByRole('button', { name: 'Pakistani number?' }));
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toHaveValue('300 123');
    await userEvent.click(canvas.getByRole('button', { name: 'Outside Pakistan?' }));
    await expect(canvas.getByRole('textbox', { name: 'Country code' })).toHaveValue('44');
  },
};

export const AbroadPhone: Story = { ...Abroad, globals: { surface: 'light', viewport: { value: 'phone' } } };
