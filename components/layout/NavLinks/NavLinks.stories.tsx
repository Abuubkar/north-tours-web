import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { markedLinks, scrollThrough } from '../../../.storybook/markedLinks';
import { roomBelow } from '../../../.storybook/scrollRoom';
import { NavLinks } from './NavLinks';

const PAGES = [
  ['Tours', '/tours'],
  ['Destinations', '/destinations'],
  ['Private trips', '/plan'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const onPath = (pathname: string) => ({ nextjs: { appDirectory: true, navigation: { pathname } } });

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

/** The five pages in order, none a section of a page; on the About page, About is the current item (gold). */
export const OnAboutPage: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const nav = canvas.getByRole('navigation', { name: args.variant === 'footer' ? 'Footer' : 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(PAGES);
    await expect(markedLinks(canvasElement)).toEqual(['About (page)']);
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

/** Tours covers every tour page, and Destinations every destination page. */
export const OnDestinationPage: Story = {
  parameters: onPath('/destinations/hunza'),
  play: async ({ canvasElement }) => {
    await expect(markedLinks(canvasElement)).toEqual(['Destinations (page)']);
  },
};

/** On the Homepage no item is marked, wherever the page is scrolled: the nav marks pages, not sections. */
export const OnHomepage: Story = {
  parameters: onPath('/'),
  decorators: [roomBelow],
  play: async ({ canvasElement }) => {
    await scrollThrough(async () => expect(markedLinks(canvasElement)).toEqual([]));
  },
};

export const OnHomepageOnLight: Story = { ...OnHomepage, globals: { surface: 'light' } };
