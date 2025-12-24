import { build } from 'tsup';
// Build do backend
await build({
  entry: ['src/**/*.ts'],
  outDir: 'dist',
  format: 'esm',
  dts: false,
  clean: true,
  bundle: false,
  minify: false,
  splitting: false,
  sourcemap: false,
  target: 'es2020'
});
// Build do frontend
await build({
  entry: ['Tke_Front_end/**/*'],
  outDir: 'dist/public',
  format: 'esm',
  dts: false,
  clean: true,
  bundle: false,
  minify: false,
  splitting: false,
  sourcemap: false,
  target: 'es2020'
});