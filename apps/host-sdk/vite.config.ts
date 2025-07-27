/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(({ mode }) => {
  const isCDNBuild = mode === "production";

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/host-sdk',
    server: {
      port: 5173,
      host: 'localhost',
    },
    preview: {
      port: 5173,
      host: 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    build: {
      outDir: '../../dist/apps/host-sdk',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
    },
    base: isCDNBuild ? 'https://sdk.chekin.com/' : '/',
  };
});
