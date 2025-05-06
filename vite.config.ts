import type { UserConfig } from 'vite'

export default {
  build: {
    lib: {
      entry: ['examples/index.ts'],
      fileName: (format, entryName) => `pipegpu-lib-${entryName}.${format}.js`,
      cssFileName: 'pipegpu-lib-style',
    },
  },
} satisfies UserConfig