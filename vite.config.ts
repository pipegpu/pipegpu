import type { UserConfig } from 'vite'

export default {
  build: {
    lib: {
      entry: ['src/index.ts'],
      fileName: (format, entryName) => `pipegpu-lib-${entryName}.${format}.js`,
      cssFileName: 'pipegpu-lib-style',
    },
  },
} satisfies UserConfig