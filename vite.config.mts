import { defineConfig, mergeConfig } from 'vite';
import { reactConfig } from '@nativescript/vite/react';
import { protect, restore } from './postcss-masonkit.mjs';
import { masonkitSingleInstance } from './masonkit-hmr.mjs';
import { escapedSelectorCommas } from './postcss-selector-commas.mjs';
import { nativeColors } from './postcss-native-colors.mjs';
import { nativescriptReact } from './react-workarounds.mjs';
import { stableActivityChunk } from './android-workarounds.mjs';
import { canvasPlatformFile } from './canvas-workarounds.mjs';

export default defineConfig(({ mode }) =>
  mergeConfig(reactConfig({ mode }), {
    plugins: [...nativescriptReact(), masonkitSingleInstance(), stableActivityChunk(), canvasPlatformFile()],
    optimizeDeps: {
      // MasonKit must load as a single instance over the HMR server. If Vite
      // pre-bundles a subpath (e.g. `/elements`), that copy is routed to the
      // vendor bundle, where MasonKit is deliberately absent, and its exports
      // come back undefined.
      exclude: [
        '@triniwiz/nativescript-masonkit',
        '@triniwiz/nativescript-masonkit/web',
        '@triniwiz/nativescript-masonkit/elements',
      ],
    },
    css: {
      postcss: {
        // Lets Tailwind layout utilities (flex, grid, gap, max-w, ...) and
        // `hover:` styles reach MasonKit views instead of being stripped,
        // keeps classes with commas in them, like `grid-cols-[repeat(...,...)]`,
        // and converts shadcn's colors (see postcss-native-colors.mjs).
        plugins: [protect(), restore(), escapedSelectorCommas(), nativeColors()],
      },
    },
  }),
);
