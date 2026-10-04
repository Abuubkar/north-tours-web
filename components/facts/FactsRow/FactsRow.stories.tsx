import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { FactCell } from '../FactCell/FactCell';
import { FactsRow } from './FactsRow';

const meta = {
  title: 'Facts/FactsRow',
  component: FactsRow,
  args: {
    children: (
      <>
        <FactCell label="Best season">April – October</FactCell>
        <FactCell label="Altitude">2,438 m</FactCell>
        <FactCell label="From Lahore">2 days by road</FactCell>
        <FactCell label="Tours">2</FactCell>
      </>
    ),
  },
} satisfies Meta<typeof FactsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const cells = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll<HTMLElement>('dl > div')];

/** A description list: each label names its value. Four across from about 700px. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Altitude', { selector: 'dt' }).nextElementSibling).toHaveTextContent('2,438 m');
    await expect(gridColumns(cells(canvasElement))).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(gridColumns(cells(canvasElement))).toBe(2);
  },
};
