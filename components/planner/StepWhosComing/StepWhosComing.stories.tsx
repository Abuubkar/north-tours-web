import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { noSavedPlanner, samplePlannerCopy, withPlanner } from '../samplePlanner';
import { StepWhosComing } from './StepWhosComing';

const meta = {
  title: 'Planner/StepWhosComing',
  component: StepWhosComing,
  args: { copy: samplePlannerCopy.whosComing },
  decorators: [withPlanner],
  beforeEach: noSavedPlanner,
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof StepWhosComing>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

const button = (canvas: Canvas, name: string) => canvas.getByRole('button', { name });

/** Group size and the five optional questions, each a named group; chips wrap without scrolling sideways. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    for (const name of ['Group size', 'Group type', 'Hotels', 'Transport', 'Departing from', 'Budget per person']) {
      await expect(canvas.getByRole('group', { name })).toBeVisible();
    }
    await expect(canvas.getByRole('group', { name: 'Adults' })).toHaveTextContent('2');
    await expect(canvas.getByRole('group', { name: 'Children' })).toHaveTextContent('0');
    await expect(button(canvas, 'Lahore')).toHaveAttribute('aria-pressed', 'true');
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Laptop: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'laptop' } } };

export const Phone: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Real keys: "More children" twice shows Child 1 and Child 2, side by side; "Fewer children" removes Child 2 and its age. */
export const ChildrenAges: Story = {
  play: async ({ canvas, userEvent }) => {
    const user = await realUser();
    if (!user) return;
    await expect(canvas.queryByRole('combobox')).toBeNull();
    button(canvas, 'More children').focus();
    await user.keyboard('{Enter}{Enter}');
    const first = canvas.getByRole('combobox', { name: 'Child 1' });
    const second = canvas.getByRole('combobox', { name: 'Child 2' });
    await expect(first.getBoundingClientRect().top).toBe(second.getBoundingClientRect().top);
    await userEvent.selectOptions(first, 'Under 2');
    await userEvent.selectOptions(second, '9');
    button(canvas, 'Fewer children').focus();
    await user.keyboard(' ');
    await expect(canvas.queryByRole('combobox', { name: 'Child 2' })).toBeNull();
    await expect(canvas.getByRole('combobox', { name: 'Child 1' })).toHaveDisplayValue('Under 2');
    await userEvent.click(button(canvas, 'More children'));
    await expect(canvas.getByRole('combobox', { name: 'Child 2' })).toHaveValue('');
  },
};

export const ChildrenAgesPhone: Story = { ...ChildrenAges, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Adults stop at 1 and 40; the button at the limit is aria-disabled and keeps focus (real keys). */
export const AdultLimits: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const adults = canvas.getByRole('group', { name: 'Adults' });
    const fewer = button(canvas, 'Fewer adults');
    fewer.focus();
    await user.keyboard('{Enter}{Enter}');
    await expect(adults).toHaveTextContent('1');
    await expect(fewer).toHaveAttribute('aria-disabled', 'true');
    await expect(fewer).toHaveFocus();
    const more = button(canvas, 'More adults');
    more.focus();
    for (let i = 0; i < 40; i++) await user.keyboard('{Enter}');
    await expect(adults).toHaveTextContent('40');
    await expect(more).toHaveAttribute('aria-disabled', 'true');
    await expect(more).toHaveFocus();
  },
};

/** Real keys: each optional group takes one chip and clears on a second press; Departing from always keeps one. */
export const Chips: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const press = async (chip: HTMLElement) => {
      chip.focus();
      await user.keyboard(' ');
    };
    for (const [group, a, b] of [
      ['Group type', 'Family', 'Couple'],
      ['Hotels', 'Comfortable', 'Best available'],
      ['Transport', 'Car', 'Let us suggest'],
      ['Budget per person', 'Under PKR 50k', 'Not sure yet'],
    ]) {
      const chips = within(canvas.getByRole('group', { name: group }));
      await press(chips.getByRole('button', { name: a }));
      await press(chips.getByRole('button', { name: b }));
      await expect(chips.getByRole('button', { name: a })).toHaveAttribute('aria-pressed', 'false');
      await expect(chips.getByRole('button', { name: b })).toHaveAttribute('aria-pressed', 'true');
      await press(chips.getByRole('button', { name: b }));
      await expect(chips.queryAllByRole('button', { pressed: true })).toHaveLength(0);
    }
    await press(button(canvas, 'Lahore'));
    await expect(button(canvas, 'Lahore')).toHaveAttribute('aria-pressed', 'true');
  },
};

/** "Other city" shows "Which city?"; Lahore hides it again. */
export const OtherCity: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(button(canvas, 'Other city'));
    const city = canvas.getByRole('textbox', { name: 'Other city' });
    await expect(city).toHaveAttribute('placeholder', 'Which city?');
    await userEvent.type(city, 'Faisalabad');
    await expect(city).toHaveValue('Faisalabad');
    await userEvent.click(button(canvas, 'Lahore'));
    await expect(canvas.queryByRole('textbox', { name: 'Other city' })).toBeNull();
  },
};

export const OtherCityPhone: Story = { ...OtherCity, globals: { surface: 'light', viewport: { value: 'phone' } } };
