import type { Decorator } from '@storybook/nextjs-vite';
import styles from '../components/ui/stories.module.css';

/** Scroll room above the story, so it starts below the fold (motion stories). */
export const roomAbove: Decorator = (Story) => (
  <>
    <div className={styles.scrollRoom} />
    <Story />
  </>
);

/** Scroll room below the story, so it can scroll away (motion stories). */
export const roomBelow: Decorator = (Story) => (
  <>
    <Story />
    <div className={styles.scrollRoom} />
  </>
);

/** Scrolls the page from the top to the bottom in steps, running `check` at each, then back to the top. */
export async function scrollThrough(check: () => Promise<void>, steps = 5) {
  const bottom = document.documentElement.scrollHeight - window.innerHeight;
  if (bottom <= 0) throw new Error('The page has no room to scroll; add roomBelow.');
  for (let i = 0; i <= steps; i++) {
    window.scrollTo({ top: (bottom * i) / steps, behavior: 'instant' });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await check();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}
