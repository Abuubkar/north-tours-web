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
