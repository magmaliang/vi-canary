import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import path, { resolve } from 'path';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteCommonjs(),
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
    tsconfigPaths()
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      generateScopedName: '[local]-[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src/'),
      '@components': resolve(__dirname, 'src/components')
    },
  }
});
