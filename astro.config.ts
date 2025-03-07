import { resolve } from 'node:path'; // eslint-disable-line unicorn/import-style, import-x/no-nodejs-modules -- This is a node script

import sitemap from '@astrojs/sitemap';
import { shield } from '@kindspells/astro-shield';
import playformCompress from '@playform/compress';
import astroPwa from '@vite-pwa/astro';
import type { PwaOptions } from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

import manifest from './webmanifest.json';

const pwsOpts: PwaOptions = {
  // experimental: {
  //   directoryAndTrailingSlashHandler: true,
  // },
  includeAssets: [ 'icon.svg' ],
  manifest,
  manifestFilename: 'site.webmanifest',
  registerType: 'autoUpdate',
  workbox: {
    globIgnores: [ '404.html' ],
    globPatterns: [ '**/*.{css,js,html,svg,png,jpg,webp,woff2}' ],
    // Meant to be used in a SPA scenario, which is not this.
    // https://developer.chrome.com/docs/workbox/modules/workbox-build#property-GeneratePartial-navigateFallback
    // navigateFallback: '/',
  },
};

const modulePath = resolve(import.meta.dirname, 'generated', 'sriHashes.mjs');

// https://astro.build/config
export default defineConfig({ // eslint-disable-line import-x/no-default-export -- Config needs default export
  integrations: [
    astroPwa(pwsOpts),
    playformCompress({
      // Using an inline web component which html-minifier-terser doesn't treat as inline, and removes
      // the spaces around the tag. So for now need to keep at least one space, but remove runs.
      // https://github.com/terser/html-minifier-terser/issues/192
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Externally specified configuration
      HTML: {
        'html-minifier-terser': {
          conservativeCollapse: true,
          preserveLineBreaks: true, // One long line just makes inspecting the file harder. This doesn't change the actual file size.
        },
      },
    }),
    // Use this file to update the CSP headers with the SRI hashes
    shield({ sri: { hashesModule: modulePath } }),
    sitemap(),
  ],
  site: 'https://rob.gant.ninja',
  vite: {
    build: {
      // Prevents inlining of CSS, JS and images which is better for security.
      assetsInlineLimit: 0,
    },
  },
});
