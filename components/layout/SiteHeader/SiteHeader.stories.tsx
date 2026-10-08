import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { markedLinks, onPath } from '../../../.storybook/markedLinks';
import { parkPointer } from '../../../.storybook/parkPointer';
import { realUser } from '../../../.storybook/realUser';
import { roomBelow, scrollThrough } from '../../../.storybook/scrollRoom';
import { placeholderSettings, realSettings } from '../sampleSettings';
import { SiteHeader } from './SiteHeader';

const NAV = [
  ['Home', '/'],
  ['Tours', '/tours'],
  ['Destinations', '/destinations'],
  ['Private trips', '/plan'],
  ['About', '/about'],
  ['Contact', '/contact'],
];
const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';
const GOLD = 'rgb(217, 180, 74)';
const INK_900 = 'rgb(12, 18, 22)';
const TEXT = 'rgb(241, 238, 232)';

type Canvas = ReturnType<typeof within>;

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  args: { settings: placeholderSettings },
  parameters: { ...onPath('/help'), fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The brand link is the brand name alone, with no mark after it. */
async function expectBrand(canvas: Canvas) {
  const brand = canvas.getByRole('link', { name: '[BRAND NAME]' });
  await expect(brand).toHaveAttribute('href', '/');
  await expect(brand.textContent).toBe('[BRAND NAME]');
}

/**
 * The full 2f bar (from 1200px): a solid Ink bar 76px tall with no hairline, the brand, the six
 * pages (18/700, 36px apart) and the bordered 52px "WhatsApp" button; Menu and the WhatsApp square
 * are hidden.
 */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(header).toHaveAttribute('data-surface', 'dark');
    const { backgroundColor, backdropFilter, borderBottomWidth, height } = getComputedStyle(header);
    await expect([backgroundColor, backdropFilter, borderBottomWidth, height]).toEqual([INK_900, 'none', '0px', '76px']);
    await expectBrand(canvas);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(NAV);
    for (const link of links) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
      const { fontSize, fontWeight } = getComputedStyle(link);
      await expect([fontSize, fontWeight]).toEqual(['18px', '700']);
    }
    await expect(links[1].getBoundingClientRect().left - links[0].getBoundingClientRect().right).toBeGreaterThanOrEqual(36);
    const whatsapp = canvas.getByRole('link', { name: 'WhatsApp' });
    await expect(whatsapp).toBeVisible();
    const button = getComputedStyle(whatsapp);
    await expect([button.height, button.borderTopWidth, button.borderTopColor, button.fontWeight]).toEqual(['52px', '2px', TEXT, '700']);
    await expect(canvas.queryByRole('link', { name: 'Chat on WhatsApp' })).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
  },
};

/** On a light page the header stays dark. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light' } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390: a 64px bar with the brand, a 48px bordered WhatsApp square and the bordered "Menu" button. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('banner')).height).toBe('64px');
    await expectBrand(canvas);
    await expect(canvas.queryByRole('navigation', { name: 'Main' })).toBeNull();
    await expect(canvas.queryByRole('link', { name: 'WhatsApp' })).toBeNull();
    const whatsapp = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsapp).toBeVisible();
    const { width, height } = whatsapp.getBoundingClientRect();
    await expect([width, height]).toEqual([48, 48]);
    await expect(getComputedStyle(whatsapp).borderTopWidth).toBe('2px');
    const menu = canvas.getByRole('button', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getBoundingClientRect().height).toBe(48);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The current page's item is gold and marked aria-current="page": Home on the Homepage. */
export const ActiveItem: Story = {
  parameters: onPath('/'),
  play: async ({ canvas, canvasElement }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(markedLinks(nav)).toEqual(['Home (page)']);
    await parkPointer(canvasElement);
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => getComputedStyle(link).color)).toEqual([GOLD, TEXT, TEXT, TEXT, TEXT, TEXT]);
  },
};

export const ActiveItemOnLight: Story = { ...ActiveItem, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a tour page, Tours is the current item, and no other. */
export const OnTourPage: Story = {
  parameters: onPath('/tours/hunza-skardu-grand'),
  play: async ({ canvas }) => {
    await expect(markedLinks(canvas.getByRole('navigation', { name: 'Main' }))).toEqual(['Tours (page)']);
  },
};

/** On the Trip Planner, Private trips is the current item. */
export const OnPlanner: Story = {
  parameters: onPath('/plan'),
  play: async ({ canvas }) => {
    await expect(markedLinks(canvas.getByRole('navigation', { name: 'Main' }))).toEqual(['Private trips (page)']);
  },
};

export const OnPlannerOnLight: Story = { ...OnPlanner, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a page outside the nav, no item is current. */
export const NoCurrentItem: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    for (const link of within(nav).getAllByRole('link')) await expect(link).not.toHaveAttribute('aria-current');
  },
};

const whatsappLinks = (canvas: Canvas) => [
  canvas.getByRole('link', { name: 'WhatsApp', hidden: true }),
  canvas.getByRole('link', { name: 'Chat on WhatsApp', hidden: true }),
];

/** While the number is a placeholder, both WhatsApp links open with the message and no number. */
export const PlaceholderWhatsApp: Story = {
  play: async ({ canvas }) => {
    for (const link of whatsappLinks(canvas)) await expect(link).toHaveAttribute('href', `https://wa.me/?${MESSAGE}`);
  },
};

/** With a real number, both WhatsApp links carry its digits and the general message. */
export const RealWhatsApp: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    for (const link of whatsappLinks(canvas)) {
      await expect(link).toHaveAttribute('href', `https://wa.me/923001234567?${MESSAGE}`);
    }
  },
};

/**
 * At the header breakpoint (1200px) the full bar fits on one row: brand, the six pages and
 * "WhatsApp", every link at least 44×44, at least 24px between the groups, nothing overflowing.
 */
export const HeaderBreakpoint: Story = {
  globals: { viewport: { value: 'headerBreakpoint' } },
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expectBrand(canvas);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(nav).toBeVisible();
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    for (const link of within(nav).getAllByRole('link')) {
      const { width, height } = link.getBoundingClientRect();
      await expect([width >= 44, height >= 44]).toEqual([true, true]);
    }
    const brand = canvas.getByRole('link', { name: '[BRAND NAME]' }).getBoundingClientRect();
    const button = canvas.getByRole('link', { name: 'WhatsApp' }).getBoundingClientRect();
    const { left, right } = nav.getBoundingClientRect();
    await expect(left - brand.right).toBeGreaterThanOrEqual(24);
    await expect(button.left - right).toBeGreaterThanOrEqual(24);
    await expect(button.right).toBeLessThanOrEqual(header.getBoundingClientRect().right);
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
  },
};

export const HeaderBreakpointOnLight: Story = { ...HeaderBreakpoint, globals: { surface: 'light', viewport: { value: 'headerBreakpoint' } } };

/** At 1199px the full bar gives way to the phone bar (WhatsApp square and Menu), and nothing overflows. */
export const BelowHeaderBreakpoint: Story = {
  globals: { viewport: { value: 'belowHeaderBreakpoint' } },
  play: async (context) => {
    await Phone.play!(context);
    const header = context.canvas.getByRole('banner');
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
  },
};

export const BelowHeaderBreakpointOnLight: Story = {
  ...BelowHeaderBreakpoint,
  globals: { surface: 'light', viewport: { value: 'belowHeaderBreakpoint' } },
};

/** Keyboard focus shows the 2px ring on the nav links and "WhatsApp" (real key presses). */
export const FocusRing: Story = {
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    const expectRing = async (element: HTMLElement) => {
      await expect(element).toHaveFocus();
      const { outlineStyle, outlineWidth } = getComputedStyle(element);
      await expect([outlineStyle, outlineWidth]).toEqual(['solid', '2px']);
    };
    await keys.keyboard('{Tab}{Tab}');
    await expectRing(canvas.getByRole('link', { name: 'Home' }));
    await keys.keyboard('{Tab}{Tab}{Tab}{Tab}{Tab}{Tab}');
    await expectRing(canvas.getByRole('link', { name: 'WhatsApp' }));
  },
};

/** At 390 the WhatsApp square and Menu show the ring too. */
export const FocusRingPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Tab}{Tab}');
    const whatsapp = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsapp).toHaveFocus();
    await expect(getComputedStyle(whatsapp).outlineStyle).toBe('solid');
    await keys.keyboard('{Tab}');
    const menu = canvas.getByRole('button', { name: 'Menu' });
    await expect(menu).toHaveFocus();
    await expect(getComputedStyle(menu).outlineStyle).toBe('solid');
  },
};

/**
 * Real keys at 390: Enter on Menu opens the menu drawer with the six pages, the current one
 * (Tours, on a tour page) gold and marked; Escape closes it and focus returns to Menu. The menu's
 * behaviour is the Sheet's, unchanged.
 */
export const MenuWithKeys: Story = {
  parameters: onPath('/tours/hunza-skardu-grand'),
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Tab}{Tab}{Tab}');
    const menu = canvas.getByRole('button', { name: 'Menu' });
    await expect(menu).toHaveFocus();
    await keys.keyboard('{Enter}');
    const dialog = await canvas.findByRole('dialog', { name: 'Menu' });
    await expect(dialog.matches(':modal')).toBe(true);
    const nav = within(dialog).getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(NAV);
    await expect(markedLinks(nav)).toEqual(['Tours (page)']);
    await expect(getComputedStyle(links[1]).color).toBe(GOLD);
    await keys.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(menu).toHaveFocus();
  },
};

export const MenuWithKeysOnLight: Story = { ...MenuWithKeys, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** On the Homepage, Home is the current item, wherever the page is scrolled (ADR-0027). */
export const OnHomepage: Story = {
  parameters: { ...onPath('/'), fullBleed: true },
  decorators: [roomBelow],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await scrollThrough(async () => expect(markedLinks(nav)).toEqual(['Home (page)']));
  },
};

export const OnHomepageOnLight: Story = { ...OnHomepage, globals: { surface: 'light', viewport: { value: 'desktop' } } };
