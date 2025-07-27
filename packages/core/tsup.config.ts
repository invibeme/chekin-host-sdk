import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],           // Dual format: CommonJS + ES modules
  dts: true,                        // Generate TypeScript declarations
  splitting: false,                 // Keep bundle simple for SDK
  sourcemap: true,
  clean: true,
  external: [],                     // No externals for framework-agnostic core
  minify: true,
  target: 'es2018'                  // Browser compatibility
})