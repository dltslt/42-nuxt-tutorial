import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

type Entry = { path: string, kind: 'file' | 'dir' }

// Lists the production build. `make build` is what creates `.output/`.
export default defineEventHandler(async (event) => {
  const root = join(process.cwd(), '.output')
  const top = await readdir(root, { withFileTypes: true }).catch(() => null)
  if (!top) {
    const body = { present: false, entries: [] as Entry[] }
    if (event.context.trace) event.context.trace.body = body
    return body
  }

  const entries: Entry[] = []
  const ordered = [...top].sort((left, right) => left.name.localeCompare(right.name))
  for (const item of ordered) {
    const kind = item.isDirectory() ? 'dir' : 'file'
    entries.push({ path: item.name, kind })
    if (kind !== 'dir' || (item.name !== 'server' && item.name !== 'public')) continue
    const children = await readdir(join(root, item.name), { withFileTypes: true }).catch(() => [])
    for (const child of [...children].sort((left, right) => left.name.localeCompare(right.name))) {
      entries.push({
        path: `${item.name}/${child.name}`,
        kind: child.isDirectory() ? 'dir' : 'file'
      })
    }
  }

  const body = { present: true, entries }
  if (event.context.trace) event.context.trace.body = body
  return body
})
