import { resolve } from 'node:path'; // eslint-disable-line unicorn/import-style, import-x/no-nodejs-modules -- This is a node script

import sitemap from '@astrojs/sitemap';
import { shield } from '@kindspells/astro-shield';
import playformCompress from '@playform/compress';
import astroPwa from '@vite-pwa/astro';
import type { PwaOptions } from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

import manifest from './webmanifest.json';

const pwsOpts: PwaOptions = {
  experimental: {
    // Need this because I am using build.format preserve in Astro. But this fills the precache with
    // useless paths like: 'ninja-site/developing.html' and 'ninja-site/developing/'
    directoryAndTrailingSlashHandler: true,
  },
  manifest,
  manifestFilename: 'site.webmanifest',
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: [ '**/*.{css,js,html,svg,png,jpg,webp,woff2,pdf}' ],
    // Meant to be used in a SPA scenario, which is not this.
    // https://developer.chrome.com/docs/workbox/modules/workbox-build#property-GeneratePartial-navigateFallback
    navigateFallback: '/404',
  },
};

// Cannot export to JSON currently https://github.com/kindspells/astro-shield/issues/67
const modulePath = resolve(import.meta.dirname, 'generated', 'sriHashes.mjs');

// https://astro.build/config
export default defineConfig({ // eslint-disable-line import-x/no-default-export -- Config needs default export
  build: {
    // I'm building a typical directory structure for the website as is traditional.
    format: 'preserve',
  },
  integrations: [
    astroPwa(pwsOpts),
    playformCompress({
      /* eslint-disable @typescript-eslint/naming-convention -- Externally specified configuration */
      CSS: {
        // csso was last updated in 2022, and doesn't understand modern @media modern context notation
        // https://stylelint.io/user-guide/rules/media-feature-range-notation/
        csso: false,
        lightningcss: {
          minify: true,
        },
      },
      // Using an inline web component which html-minifier-terser doesn't treat as inline, and removes
      // the spaces around the tag. So for now need to keep at least one space, but remove runs.
      // https://github.com/terser/html-minifier-terser/issues/192
      HTML: {
        'html-minifier-terser': {
          conservativeCollapse: true,
          preserveLineBreaks: true, // One long line just makes inspecting the file harder. This doesn't change the actual file size.
        },
      },
      /* eslint-enable @typescript-eslint/naming-convention */
    }),
    // Use this file to update the CSP headers with the SRI hashes
    shield({ sri: { hashesModule: modulePath } }),
    sitemap(),
  ],
  site: 'https://rob.gant.ninja',
  // trailingSlash: 'always', // Because I'm using build.format preserve and PWA and Amplify best to not use this.
  vite: {
    build: {
      // Prevents inlining of CSS, JS and images which is better for security.
      assetsInlineLimit: 0,
    },
    // @playform/compress uses lightningcss but if I did it this why then I could be using it directly.
    // https://blog.kizu.dev/added-lightning-css/
    // https://docs.astro.build/en/guides/styling/#lightningcss
    // css: {
    //   transformer: 'lightningcss',
    // },
  },
});
