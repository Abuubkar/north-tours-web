import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
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

/** Opens from the keyboard with Enter and Space (real key presses under `pnpm test`). */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Destination/ });
    trigger.focus();
    const user = await realUser();
    if (!user) return;
    await user.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Escape from inside the panel closes it and focus returns to the trigger. */
export const Escape: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /Destination/ });
    await userEvent.click(trigger);
    canvas.getByRole('button', { name: /Hunza/ }).focus();
    await expect(trigger).not.toHaveFocus();
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

/** At the right edge of a phone-width screen the panel stays fully on screen. */
export const NearRightEdge: Story = {
  render: (args) => (
    <div className={styles.rightEdge}>
      <Dropdown {...args} />
    </div>
  ),
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Destination/ }));
    const panel = canvas.getByRole('button', { name: /Hunza/ }).closest('[popover]')!;
    const box = panel.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.right).toBeLessThanOrEqual(window.innerWidth);
  },
};

/** Where CSS anchor positioning isn't supported, the script places the panel under the chip. */
export const ScriptFallback: Story = {
  play: async ({ canvas, userEvent }) => {
    const original = CSS.supports;
    Object.defineProperty(CSS, 'supports', { value: () => false, configurable: true });
    // Switch off the CSS placement so only the script can put the panel in place.
    const noAnchor = document.createElement('style');
    noAnchor.textContent = '[popover] { position-anchor: none !important; }';
    document.head.append(noAnchor);
    try {
      const trigger = canvas.getByRole('button', { name: /Destination/ });
      await userEvent.click(trigger);
      const panel = canvas.getByRole('button', { name: /Hunza/ }).closest('[popover]') as HTMLElement;
      await expect(panel.style.top).not.toBe('');
      const gap = panel.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
      await expect(gap).toBeGreaterThanOrEqual(0);
      await expect(gap).toBeLessThanOrEqual(16);
    } finally {
      Object.defineProperty(CSS, 'supports', { value: original, configurable: true });
      noAnchor.remove();
    }
  },
};
