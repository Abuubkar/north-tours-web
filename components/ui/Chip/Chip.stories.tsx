import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Chip } from './Chip';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/Chip',
  component: Chip,
  args: { variant: 'toggle', pressed: false, children: 'Family' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;
/** Stories that render their own chips instead of using args. */
type RenderStory = StoryObj;

function ToggleDemo({ label, count }: { label: string; count?: number }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Chip variant="toggle" pressed={pressed} count={count} onClick={() => setPressed(!pressed)}>
      {label}
    </Chip>
  );
}

function TriggerDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Chip variant="trigger" expanded={expanded} onClick={() => setExpanded(!expanded)}>
      Destination
    </Chip>
  );
}

const onRemove = fn();

const allVariants = () => (
  <div className={styles.stack}>
    <div className={styles.row}>
      <Chip variant="toggle" pressed={false}>Exact dates</Chip>
      <Chip variant="toggle" pressed>Flexible</Chip>
      <Chip variant="toggle" pressed={false} count={3}>Hunza</Chip>
      <Chip variant="toggle" pressed count={2}>Skardu</Chip>
    </div>
    <div className={styles.row}>
      <Chip variant="trigger" expanded={false}>Duration</Chip>
      <Chip variant="trigger" expanded>Budget</Chip>
      <Chip variant="trigger" expanded={false} active count={2}>Destination</Chip>
    </div>
    <div className={styles.row}>
      <Chip variant="removable" onRemove={onRemove}>Hunza</Chip>
      <Chip variant="removable" onRemove={onRemove}>Family</Chip>
    </div>
    <div className={styles.row}>
      <Chip variant="link" href="#booking" count={4}>Booking & payment</Chip>
      <Chip variant="link" href="#safety">Safety</Chip>
    </div>
  </div>
);

export const AllVariants: RenderStory = { render: allVariants };

/** Selected uses the raised surface on both sides; never gold. */
export const AllVariantsOnLight: RenderStory = {
  render: allVariants,
  globals: { surface: 'light' },
  play: async ({ canvas }) => {
    const pressed = canvas.getByRole('button', { name: 'Flexible' });
    // Mist 100, the light raised surface: selection is never gold.
    await expect(getComputedStyle(pressed).backgroundColor).toBe('rgb(226, 231, 235)');
  },
};

/** A toggle flips aria-pressed by mouse and by keyboard. */
export const Toggle: RenderStory = {
  render: () => <ToggleDemo label="Family" />,
  play: async ({ canvas, userEvent }) => {
    const chip = canvas.getByRole('button', { name: 'Family' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard('{Enter}');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  },
};

/** A dropdown trigger reports whether what it opens is open. */
export const Trigger: RenderStory = {
  render: () => <TriggerDemo />,
  play: async ({ canvas, userEvent }) => {
    const chip = canvas.getByRole('button', { name: 'Destination' });
    await expect(chip).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-expanded', 'false');
  },
};

const removeHunza = fn();

/** The whole chip is the remove button, so the tap target is the full 44px pill. */
export const Removable: Story = {
  args: { variant: 'removable', children: 'Hunza', onRemove: removeHunza },
  play: async ({ canvas, userEvent }) => {
    const chip = canvas.getByRole('button', { name: 'Remove filter Hunza' });
    await userEvent.click(chip);
    await expect(removeHunza).toHaveBeenCalledOnce();
    await expect(chip.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const Link: Story = {
  args: { variant: 'link', href: '#safety', children: 'Safety', count: 4 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /Safety/ })).toHaveAttribute('href', '#safety');
  },
};
