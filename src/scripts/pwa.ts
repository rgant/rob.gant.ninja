/**
 * Based on:
 * - https://astro-pwa-recipe.vercel.app/recipe/generate-sw
 * - https://github.com/vite-pwa/astro/tree/main/examples
 */
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onOfflineReady: (): void => {
    // eslint-disable-next-line no-console
    console.log('PWA application ready to work offline');
  },
  onRegisteredSW: (swScriptUrl: string): void => {
    // eslint-disable-next-line no-console
    console.log('SW registered:', swScriptUrl);
  },
});
