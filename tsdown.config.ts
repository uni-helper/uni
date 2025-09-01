import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
  },
  // format: ['esm', 'cjs'],
  dts: true,
  fixedExtension: true,
  clean: true,
  external: ['@antfu/utils'],
})
