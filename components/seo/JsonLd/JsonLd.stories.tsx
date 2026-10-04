import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { JsonLd } from './JsonLd';

const meta = {
  title: 'SEO/JsonLd',
  component: JsonLd,
  args: { data: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] } },
} satisfies Meta<typeof JsonLd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One script of type application/ld+json, which parses back to its data. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const scripts = canvasElement.querySelectorAll('script[type="application/ld+json"]');
    await expect(scripts).toHaveLength(1);
    await expect(JSON.parse(scripts[0].textContent ?? '')).toEqual(args.data);
  },
};

/** A value holding `</script>` can't close the script and add markup to the page (the escaping is unit-tested in lib/utils). */
export const ScriptInAValue: Story = {
  args: { data: { '@context': 'https://schema.org', '@type': 'TouristTrip', name: 'Hunza </script><b>bold</b>' } },
  play: async ({ canvasElement, args }) => {
    await expect(canvasElement.querySelector('b')).toBeNull();
    const script = canvasElement.querySelector('script[type="application/ld+json"]');
    await expect(JSON.parse(script?.textContent ?? '')).toEqual(args.data);
  },
};
