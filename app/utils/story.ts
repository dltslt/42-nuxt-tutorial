import type { XrayHit } from '../composables/useXray'

export type Snippet = {
  name: string
  file: string
  start: number
  end: number
  code: string
}

export type QueryTrace = {
  name: string
  sql: string
  params: unknown[]
  rows: Record<string, unknown>[]
  ms: number
}

export type RequestTrace = {
  id: string
  method: string
  path: string
  queries: QueryTrace[]
  body: unknown
  cookie?: { name: string, bytes: number } | null
}

export type StoryLayer = {
  layer: 'browser' | 'vue' | 'network' | 'server' | 'database'
  name: string
  title: string
  sentence: string
  quote?: string
  snippet?: Snippet
  record?: Record<string, unknown> | null
  focus?: string
  sql?: string
  params?: unknown[]
  ms?: number
  row?: Record<string, unknown> | null
}

function isScalar(value: unknown) {
  return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

function scalars(record: Record<string, unknown>) {
  const kept: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    if (isScalar(value)) kept[key] = value
  }
  return kept
}

// The table name is a property somewhere in the JSON. Tasks sit inside each column, not at the top.
function findNamedRow(node: unknown, table: string, rowId: string): Record<string, unknown> | null {
  if (!node || typeof node !== 'object') return null
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findNamedRow(item, table, rowId)
      if (found) return found
    }
    return null
  }
  const record = node as Record<string, unknown>
  const list = record[table]
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue
      const row = item as Record<string, unknown>
      if (String(row.id) === rowId) return scalars(row)
    }
  }
  for (const value of Object.values(record)) {
    const found = findNamedRow(value, table, rowId)
    if (found) return found
  }
  return null
}

function statementLayer(query: QueryTrace | undefined, title: string): StoryLayer {
  return {
    layer: 'database',
    name: 'Database',
    title,
    sentence: query
      ? (query.params.length
          ? `SQLite ran this in ${query.ms} ms. Each \`?\` is a parameter, listed under the statement.`
          : `SQLite ran this in ${query.ms} ms. This statement has no parameters.`)
      : 'This request did not record a statement for that name.',
    sql: query?.sql,
    params: query?.params ?? []
  }
}

export function buildStory(hit: XrayHit, trace: RequestTrace, sources: Record<string, Snippet>): StoryLayer[] {
  const query = trace.queries.find(item => item.name === hit.query)
  const write = trace.queries.find(item => item.name === 'insert-task' || item.name === 'move-task')
  const row = query?.rows.find(item => String(item.id) === hit.rowId) ?? null
  const board = hit.snippets.fetch === 'board-fetch'
  return [
    {
      layer: 'browser',
      name: 'Browser',
      title: 'The words you clicked',
      sentence: 'This is text in the window. The cards below are the steps that produced it.',
      quote: hit.words
    },
    {
      layer: 'vue',
      name: 'Vue',
      title: 'The template printed them',
      sentence: 'A Vue file has a template. `{{ }}` prints one field of the object the component was given.',
      snippet: sources[hit.snippets.template]
    },
    {
      layer: 'vue',
      name: 'Vue',
      title: board ? 'The page asked for the board' : 'The page sent the change',
      sentence: board
        ? 'The page does not contain the tasks. `useFetch` calls the server and keeps the JSON.'
        : 'The click called the server and kept the JSON it sent back. Vue then updated the board from that object.',
      snippet: sources[hit.snippets.fetch]
    },
    {
      layer: 'network',
      name: 'Network',
      title: `${trace.method} ${trace.path}`,
      sentence: trace.cookie
        ? `The browser and the server are two programs. This request carried \`${trace.cookie.name}\`, ${trace.cookie.bytes} bytes. The sealed value is not in the trace. The object below is what the server sent for the thing you clicked.`
        : 'The browser and the server are two programs. This is the object the server sent for the thing you clicked. The marked field is that value.',
      record: findNamedRow(trace.body, hit.query, hit.rowId),
      focus: hit.field
    },
    {
      layer: 'server',
      name: 'Server',
      title: 'The route handler',
      sentence: 'A file under `server/api/` becomes a URL. This function ran for the request.',
      snippet: sources[hit.snippets.handler]
    },
    ...(write ? [statementLayer(write, 'The change')] : []),
    statementLayer(query, 'The statement that ran'),
    {
      layer: 'database',
      name: 'Database',
      title: 'The row',
      sentence: 'This cell is the value that became the words on the screen.',
      row,
      focus: hit.field
    }
  ]
}

export function langFor(file: string) {
  if (file.endsWith('.vue')) return 'vue'
  if (file.endsWith('.sql')) return 'sql'
  return 'ts'
}
