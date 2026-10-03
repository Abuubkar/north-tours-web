import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Icon } from './Icon';
import { icons, type IconName } from './icons';
import styles from './Icon.stories.module.css';

const meta = {
  title: 'Base/Icon',
  component: Icon,
  args: { name: 'whatsapp', size: 24 },
  argTypes: { name: { control: 'select', options: Object.keys(icons) } },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllIcons: Story = {
  render: (args) => (
    <ul className={styles.grid}>
      {(Object.keys(icons) as IconName[]).map((name) => (
        <li key={name} className={styles.cell}>
          <Icon {...args} name={name} />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  ),
};

/** Decorative by default; a label makes it an image with that name. */
export const Labelled: Story = {
  args: { name: 'star', label: '4.9 out of 5' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '4.9 out of 5' })).toBeInTheDocument();
  },
};

export const Decorative: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};
