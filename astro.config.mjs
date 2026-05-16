// @ts-check
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import remarkCallouts from './src/lib/remark-callouts.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://siliconlogic.dev',
  integrations: [
    expressiveCode(),
  ],
  markdown: {
    remarkPlugins: [remarkCallouts],
  },
});
