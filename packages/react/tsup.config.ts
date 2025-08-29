import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      jsx: 'react-jsx',
      skipLibCheck: true,
      skipDefaultLibCheck: true,
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'chekin-host-sdk'],
  minify: true,
  target: 'es2018',
  loader: {
    '.tsx': 'tsx',
  },
});
