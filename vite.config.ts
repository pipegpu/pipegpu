import type { UserConfig } from 'vite'

export default {
  build: {
    lib: {
      name: 'pipegpu.core',
      entry: ['src/index.ts'],
      fileName: (format, _entryName) => `pipegpu.core.${format}.js`,
      cssFileName: 'pipegpu-lib-style',
      formats: ['es', 'iife', 'umd', 'cjs', 'system'],
    },
  },
} satisfies UserConfig