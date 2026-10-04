import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { DestinationChoiceCard } from './DestinationChoiceCard';
import type { DestinationChoiceCardProps } from './DestinationChoiceCard.types';
import styles from '../../ui/stories.module.css';

function Toggle(props: DestinationChoiceCardProps) {
  const [pressed, setPressed] = useState(props.pressed);
  return (
    <div className={styles.aside}>
      <DestinationChoiceCard
        {...props}
        pressed={pressed}
        onToggle={() => {
          setPressed(!pressed);
          props.onToggle();
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Planner/DestinationChoiceCard',
  component: DestinationChoiceCard,
  args: { label: 'Hunza', image: samplePhoto, pressed: false, onToggle: fn() },
  render: (args) => <Toggle {...args} />,
} satisfies Meta<typeof DestinationChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Named by the destination alone (not the photo's alt), off; a click ticks it. 8px tile. */
export const Off: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'Hunza' });
    await expect(card).toHaveAttribute('aria-pressed', 'false');
    await expect(getComputedStyle(card).borderRadius).toBe('8px');
    await userEvent.click(card);
    await expect(card).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onToggle).toHaveBeenCalledOnce();
  },
};

export const OffOnLight: Story = { ...Off, globals: { surface: 'light' } };

/** On: the shared selected state, --fg border on the raised fill, and a ticked box. */
export const On: Story = {
  args: { pressed: true },
  play: async ({ canvas }) => {
    const card = canvas.getByRole('button', { name: 'Hunza' });
    await expect(getComputedStyle(card).borderTopColor).toBe(getComputedStyle(card).color);
    await expect(card.querySelector('svg')).not.toBeNull();
  },
};

/** "Not sure": the placeholder stripes, no caption. */
export const NotSure: Story = {
  args: { label: 'Not sure, suggest something', image: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Not sure, suggest something' })).toBeVisible();
    await expect(canvas.queryByRole('img')).toBeNull();
  },
};

/** After a failed Next: the error border, and the message read when the card is focused. */
export const Invalid: Story = {
  args: { invalid: true, describedBy: 'message' },
  render: (args) => (
    <>
      <p id="message">Choose at least one destination.</p>
      <Toggle {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('button', { name: 'Hunza' });
    await expect(card).toHaveAccessibleDescription('Choose at least one destination.');
    await expect(getComputedStyle(card).borderTopColor).not.toBe(getComputedStyle(card).color);
  },
};
