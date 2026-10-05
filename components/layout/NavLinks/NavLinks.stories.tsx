import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { markedLinks, onPath } from '../../../.storybook/markedLinks';
import { parkPointer } from '../../../.storybook/parkPointer';
import { roomBelow, scrollThrough } from '../../../.storybook/scrollRoom';
import { NavLinks } from './NavLinks';

const PAGES = [
  ['Home', '/'],
  ['Tours', '/tours'],
  ['Destinations', '/destinations'],
  ['Private trips', '/plan'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const meta = {
  title: 'Layout/NavLinks',
  component: NavLinks,
  args: { variant: 'header' },
  argTypes: { variant: { control: 'inline-radio', options: ['header', 'menu', 'footer'] } },
  parameters: onPath('/about'),
} satisfies Meta<typeof NavLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The surface's accent where `element` is, as a computed colour ("rgb(217, 180, 74)" on dark). */
function accent(element: HTMLElement) {
  const probe = document.createElement('span');
  probe.style.color = 'var(--accent)';
  element.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

/** The six pages in order, Home first, none a section of a page; on the About page, About is the current item (gold). */
export const OnAboutPage: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const nav = canvas.getByRole('navigation', { name: args.variant === 'footer' ? 'Footer' : 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(PAGES);
    await expect(markedLinks(canvasElement)).toEqual(['About (page)']);
    // A hovered link is gold too (`a:hover`), and the pointer stays where the previous story left
    // it, possibly over one of these links: park it on a spot clear of the nav before reading colours.
    await parkPointer(canvasElement);
    const gold = accent(nav);
    for (const link of links) await expect(getComputedStyle(link).color === gold).toBe(link.textContent === 'About');
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const OnAboutPageOnLight: Story = { ...OnAboutPage, globals: { surface: 'light' } };

/** Large stacked links for the mobile menu, divided by hairlines. */
export const Menu: Story = { ...OnAboutPage, args: { variant: 'menu' } };

export const MenuOnLight: Story = { ...Menu, globals: { surface: 'light' } };

/** The footer's large stacked links, a landmark named "Footer". */
export const Footer: Story = { ...OnAboutPage, args: { variant: 'footer' } };

export const FooterOnLight: Story = { ...Footer, globals: { surface: 'light' } };

/** Tours covers every tour page, and Destinations every destination page; Home stays unmarked there. */
export const OnDestinationPage: Story = {
  parameters: onPath('/destinations/hunza'),
  play: async ({ canvasElement }) => {
    await expect(markedLinks(canvasElement)).toEqual(['Destinations (page)']);
  },
};

/** On the Homepage, Home is marked (gold), wherever the page is scrolled: the nav marks pages, not sections (ADR-0027). */
export const OnHomepage: Story = {
  parameters: onPath('/'),
  decorators: [roomBelow],
  play: async ({ canvasElement }) => {
    await scrollThrough(async () => expect(markedLinks(canvasElement)).toEqual(['Home (page)']));
    await parkPointer(canvasElement);
    const nav = canvasElement.querySelector('nav')!;
    const gold = accent(nav);
    for (const link of within(nav).getAllByRole('link')) await expect(getComputedStyle(link).color === gold).toBe(link.textContent === 'Home');
  },
};

export const OnHomepageOnLight: Story = { ...OnHomepage, globals: { surface: 'light' } };
