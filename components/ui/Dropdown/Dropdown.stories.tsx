import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { Dropdown } from './Dropdown';
import styles from './Dropdown.stories.module.css';

const destinations = [
  ['Hunza', 3],
  ['Skardu', 2],
  ['Naran-Kaghan', 1],
  ['Swat', 2],
] as const;

/** Sample option rows; real rows (with checkboxes) come with the Tours PRD. */
function Options() {
  return (
    <ul className={styles.options}>
      {destinations.map(([name, trips]) => (
        <li key={name}>
          <button type="button" className={styles.option}>
            {name}
            <span className={styles.count}>{trips}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Real key presses and clicks under `pnpm test`; null in the Storybook UI. */
const realUser = () => import('vitest/browser').then((m) => m.userEvent).catch(() => null);

const meta = {
  title: 'Base/Dropdown',
  component: Dropdown,
  args: { label: 'Destination', children: <Options /> },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Active: Story = { args: { active: true, count: 2 } };

/** Open, so the panel can be reviewed (and axe-checked) on both surfaces. */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Destination/ }));
    await expect(canvas.getByRole('button', { name: /Hunza/ })).toBeVisible();
  },
};

export const OpenOnLight: Story = { ...Open, globals: { surface: 'light' } };

/** The trigger reports open and closed, and the panel sits right under it. */
export const OpensUnderTrigger: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Destination/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = canvas.getByRole('button', { name: /Hunza/ }).closest('[popover]')!;
    const below = panel.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
    await expect(below).toBeGreaterThanOrEqual(0);
    await expect(below).toBeLessThanOrEqual(16);
    await expect(Math.abs(panel.getBoundingClientRect().left - trigger.getBoundingClientRect().left)).toBeLessThanOrEqual(1);
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Escape closes it and focus is on the trigger (real key press under `pnpm test`). */
export const Escape: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Destination/ });
    await userEvent.click(trigger);
    const user = await realUser();
    if (!user) return;
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveFocus();
  },
};

/** Clicking outside closes it (real click under `pnpm test`). */
export const ClickOutside: Story = {
  render: (args) => (
    <div className={styles.stage}>
      <Dropdown {...args} />
      <p>Somewhere else on the page</p>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Destination/ });
    await userEvent.click(trigger);
    const user = await realUser();
    if (!user) return;
    await user.click(canvas.getByText('Somewhere else on the page'));
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};
