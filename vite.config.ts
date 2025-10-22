import type { UserConfig } from 'vite'

export default {
  build: {
    lib: {
      name: 'pipegpu',
      entry: ['src/index.ts'],
      fileName: (format, entryName) => `pipegpu.${format}.js`,
      cssFileName: 'pipegpu-lib-style',
      formats: ['es', 'iife', 'umd', 'cjs', 'system'],
    },
  },
} satisfies UserConfig