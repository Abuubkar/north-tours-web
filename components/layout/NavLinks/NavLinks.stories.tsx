import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { markedLinks, scrollToSection, SpySections } from '../../../.storybook/spySections';
import { NavLinks } from './NavLinks';

const meta = {
  title: 'Layout/NavLinks',
  component: NavLinks,
  args: { variant: 'header' },
  argTypes: { variant: { control: 'inline-radio', options: ['header', 'menu'] } },
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/about' } } },
} satisfies Meta<typeof NavLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the About page, Guides is the current item (gold). */
export const OnAboutPage: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Guides' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/about#guides');
  },
};

export const OnAboutPageOnLight: Story = { ...OnAboutPage, globals: { surface: 'light' } };

/** Large stacked links for the mobile menu, divided by hairlines. */
export const Menu: Story = { ...OnAboutPage, args: { variant: 'menu' } };

export const MenuOnLight: Story = { ...Menu, globals: { surface: 'light' } };

/** The nav above a stand-in Homepage. */
function Homepage(args: Parameters<typeof NavLinks>[0]) {
  return (
    <>
      <NavLinks {...args} />
      <SpySections />
    </>
  );
}

const onHomepage = { nextjs: { appDirectory: true, navigation: { pathname: '/' } } };

/**
 * On the Homepage the nav marks the section in view, with aria-current="location": none above
 * How booking works, then How it works, Destinations and Reviews in turn. Tours and Guides lead
 * to other pages, so they're never marked here.
 */
export const ScrollSpy: Story = {
  render: Homepage,
  parameters: onHomepage,
  play: async ({ canvasElement }) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    await waitFor(() => expect(markedLinks(canvasElement)).toEqual([]));
    for (const [id, label] of [
      ['how', 'How it works'],
      ['destinations', 'Destinations'],
      ['reviews', 'Reviews'],
    ]) {
      scrollToSection(id);
      await waitFor(() => expect(markedLinks(canvasElement)).toEqual([`${label} (location)`]));
    }
    // Back above How booking works: nothing is marked again.
    window.scrollTo({ top: 0, behavior: 'instant' });
    await waitFor(() => expect(markedLinks(canvasElement)).toEqual([]));
  },
};

export const ScrollSpyOnLight: Story = { ...ScrollSpy, globals: { surface: 'light' } };

/** The menu variant follows the same section. */
export const ScrollSpyMenu: Story = { ...ScrollSpy, args: { variant: 'menu' }, globals: { viewport: { value: 'phone' } } };

export const ScrollSpyMenuOnLight: Story = { ...ScrollSpyMenu, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Off the Homepage the path rule still applies, even with those sections on the page. */
export const OffHomepage: Story = {
  render: Homepage,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/tours/hunza-skardu-grand' } } },
  play: async ({ canvasElement }) => {
    scrollToSection('reviews');
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(markedLinks(canvasElement)).toEqual(['Tours (page)']);
  },
};
