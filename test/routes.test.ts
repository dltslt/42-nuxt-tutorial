import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

// `setup` builds this app and starts a server. `$fetch` is the request.
// The database is a fresh file, so these calls do not touch `.data/tutorial.sqlite`.
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const scratch = await mkdtemp(join(tmpdir(), 'nuxt-tutorial-'))

// A test build is a production build. Nuxt does not invent an app secret for one.
const appSecret = 'nuxt-tutorial-test-secret-32chars'
process.env.NUXT_APP_SECRET = appSecret

describe('routes', async () => {
  await setup({
    rootDir,
    buildDir: join(scratch, 'build'),
    setupTimeout: 180_000,
    env: { NUXT_APP_SECRET: appSecret },
    nuxtConfig: {
      nitro: {
        experimental: { database: true },
        database: {
          default: {
            connector: 'node-sqlite',
            options: { path: join(scratch, 'tutorial.sqlite') }
          }
        }
      }
    }
  })

  it('returns the seeded Dinner task', async () => {
    const board = await $fetch<{ columns: { tasks: { title: string }[] }[] }>('/api/board')
    const titles = board.columns.flatMap(column => column.tasks.map(task => task.title))
    expect(titles).toContain('Dinner')
    expect(titles).toContain('cut the bread')
  })

  it('refuses GET /api/me without a session', async () => {
    await expect($fetch('/api/me')).rejects.toMatchObject({ statusCode: 401 })
  })

  it('seals a session for a known actor', async () => {
    const body = await $fetch<{ user: { id: string, name: string } }>('/api/login', {
      method: 'POST',
      body: { id: 'ada', password: 'bread' }
    })
    expect(body.user).toEqual({ id: 'ada', name: 'Ada' })
  })

  it('rejects a wrong password', async () => {
    await expect($fetch('/api/login', {
      method: 'POST',
      body: { id: 'ada', password: 'nope' }
    })).rejects.toMatchObject({ statusCode: 401 })
  })
})
