import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { shield } from '@kindspells/astro-shield';
import playformCompress from '@playform/compress';
import astroPwa from '@vite-pwa/astro';
import type { PwaOptions } from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

import manifest from './webmanifest.json';

const pwsOpts: PwaOptions = {
  experimental: {
    directoryAndTrailingSlashHandler: true,
  },
  includeAssets: [ 'icon.svg' ],
  manifest,
  manifestFilename: 'site.webmanifest',
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: [ '**/*.{css,js,html,svg,png,ico,txt}' ],
    navigateFallback: '/',
  },
};

// https://astro.build/config
export default defineConfig({ // eslint-disable-line import-x/no-default-export -- Config needs default export
  integrations: [
    mdx(),
    astroPwa(pwsOpts),
    playformCompress(),
    shield({}),
    sitemap(),
  ],
  site: 'https://rob.gant.ninja',
});
