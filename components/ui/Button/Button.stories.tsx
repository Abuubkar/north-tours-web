import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Button } from './Button';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/Button',
  component: Button,
  args: { children: 'Explore Tours', variant: 'primary', size: 52, onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'quiet'] },
    size: { control: 'inline-radio', options: [44, 48, 52, 56] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { arrow: true } };

export const Secondary: Story = {
  args: { variant: 'secondary', icon: 'whatsapp', children: 'Plan on WhatsApp' },
};

export const Quiet: Story = { args: { variant: 'quiet', children: 'Join waitlist' } };

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className={styles.stack}>
      {(['primary', 'secondary', 'quiet'] as const).map((variant) => (
        <div key={variant} className={styles.row}>
          {([44, 48, 52, 56] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              {`${variant} ${size}`}
            </Button>
          ))}
          <Button variant={variant} disabled>
            {`${variant} disabled`}
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** The same set on the light surface, so axe checks light contrast too. */
export const AllVariantsAndSizesOnLight: Story = {
  ...AllVariantsAndSizes,
  globals: { surface: 'light' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-surface]')).toHaveAttribute('data-surface', 'light');
  },
};

/** With an href it is a link, so it can be opened in a new tab and shared. */
export const AsLink: Story = {
  args: { href: 'https://wa.me/', children: 'Chat on WhatsApp', icon: 'whatsapp' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(link).toHaveAttribute('href', 'https://wa.me/');
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const AsButton: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Explore Tours' });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: { children: 'Reserve with [X]% advance', disabled: true },
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Reserve with [X]% advance' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** aria-disabled: the disabled look, but it stays focusable, so keyboard focus isn't lost (e.g. Reserve before a date). */
export const AriaDisabled: Story = {
  args: { children: 'Reserve with 30% advance', 'aria-disabled': true, size: 48 },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Reserve with 30% advance' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    button.focus();
    await expect(button).toHaveFocus();
    await expect(getComputedStyle(button).cursor).toBe('not-allowed');
  },
};

export const AriaDisabledOnLight: Story = { ...AriaDisabled, globals: { surface: 'light' } };

/** A toggle that's on (aria-pressed) takes the shared selected state: the raised surface. */
export const Pressed: Story = {
  args: { variant: 'secondary', size: 48, children: 'Selected', 'aria-pressed': true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Selected', pressed: true });
    await expect(getComputedStyle(button).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

export const PressedOnLight: Story = { ...Pressed, globals: { surface: 'light' } };

/** Every button is at least the 44px tap target. */
export const TapTarget: Story = {
  args: { size: 44, variant: 'quiet', children: 'Instagram' },
  play: async ({ canvas }) => {
    const { height } = canvas.getByRole('button').getBoundingClientRect();
    await expect(height).toBeGreaterThanOrEqual(44);
  },
};
