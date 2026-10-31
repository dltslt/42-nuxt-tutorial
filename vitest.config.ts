import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

// Route tests start their own server. The component test mounts inside Vitest.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'routes',
          include: ['test/routes.test.ts'],
          environment: 'node',
          hookTimeout: 180_000,
          testTimeout: 30_000
        }
      },
      await defineVitestProject({
        test: {
          name: 'component',
          include: ['test/component.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom'
            }
          }
        }
      })
    ]
  }
})
