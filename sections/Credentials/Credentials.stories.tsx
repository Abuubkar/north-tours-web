import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Credentials } from './Credentials';

/** As the page shapes them from today's settings (placeholders as written) and the sample membership. */
const credentials = {
  label: 'Credentials',
  licence: { label: 'Tour operator licence', value: 'DTS licence No. [DTS licence number]', note: 'Department of Tourist Services, Punjab' },
  company: { label: 'Company', value: '[SECP or NTN number]' },
  memberships: { label: 'Memberships', names: ['[Tour operators’ association]'] },
};

const meta = {
  title: 'Sections/Credentials',
  component: Credentials,
  args: { credentials },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof Credentials>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Credentials" is the section's <h2>; the licence and registration placeholders show as written. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'Credentials' });
    await expect(getComputedStyle(heading).fontSize).toBe('13px');
    const terms = canvas.getAllByRole('term');
    await expect(terms.map((t) => t.textContent)).toEqual(['Tour operator licence', 'Company', 'Memberships']);
    await expect(terms[0].getBoundingClientRect().width).toBe(200);
    const values = canvas.getAllByRole('definition');
    await expect(values[0]).toHaveTextContent('DTS licence No. [DTS licence number]Department of Tourist Services, Punjab');
    await expect(values[1]).toHaveTextContent('[SECP or NTN number]');
    await expect(values[2]).toHaveTextContent('[Tour operators’ association]');
    // The rows sit beside the label column.
    await expect(terms[0].getBoundingClientRect().left).toBeGreaterThan(heading.getBoundingClientRect().right);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the rows wrap under the label, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'Credentials' });
    await expect(canvas.getAllByRole('term')[0].getBoundingClientRect().top).toBeGreaterThan(heading.getBoundingClientRect().bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With no memberships the row is left out. */
export const NoMemberships: Story = {
  args: { credentials: { ...credentials, memberships: { ...credentials.memberships, names: [] } } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('term').map((t) => t.textContent)).toEqual(['Tour operator licence', 'Company']);
    await expect(canvas.queryByText('Memberships')).toBeNull();
  },
};

export const NoMembershipsOnLight: Story = { ...NoMemberships, globals: { surface: 'light', viewport: { value: 'desktop' } } };
