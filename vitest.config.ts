import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    // environment: 'edge-runtime',
    exclude: [],
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)']
  }
})