import { defineConfig } from 'vitest/config'

/**
 * 
 * https://vitest.dev/guide/browser/#browser-option-types
 * - webdriverio support chrome env
 * - webdriverio chrome support webgpu context
 * 
 */
export default defineConfig({
  test: {
    browser: {
      provider: 'webdriverio', // playwright
      enabled: true,
      instances: [
        { browser: 'chrome' },
      ],
    },
    // environment: 'edge-runtime',
    exclude: [],
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)']
  }
})