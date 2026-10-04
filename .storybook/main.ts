import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.tsx', '../sections/**/*.stories.tsx'],
  // Generated photo variants (ADR-0015), so stories show real photos.
  staticDirs: ['../public'],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: '@storybook/nextjs-vite',
  core: { disableTelemetry: true },
};

export default config;
