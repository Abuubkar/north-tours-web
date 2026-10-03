import type { Preview } from '@storybook/nextjs-vite';
import { Geist } from 'next/font/google';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/globals.css';
import styles from './preview.module.css';

// Same font setup as the root layout: the variable must sit on <html> so --font resolves.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
document.documentElement.classList.add(geist.variable);

const viewport = (name: string, width: number, height: number) => ({
  name,
  styles: { width: `${width}px`, height: `${height}px` },
  type: width < 768 ? 'mobile' : 'desktop',
});

const preview: Preview = {
  globalTypes: {
    surface: {
      description: 'Surface the story sits on (ADR-0011)',
      toolbar: {
        title: 'Surface',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { surface: 'dark' },
  decorators: [
    (Story, { globals }) => (
      <div className={styles.surface} data-surface={globals.surface === 'light' ? 'light' : 'dark'}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    viewport: {
      options: {
        phone: viewport('Phone 390', 390, 844),
        laptop: viewport('Laptop 1366', 1366, 768),
        desktop: viewport('Desktop 1440', 1440, 900),
      },
    },
  },
};

export default preview;
