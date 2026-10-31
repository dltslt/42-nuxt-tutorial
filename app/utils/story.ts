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

export type BoardTrace = {
  id: string
  method: string
  path: string
  queries: QueryTrace[]
  body: {
    columns?: Array<{
      id: string
      title: string
      state: string
      tasks?: Record<string, unknown>[]
    }>
    blockers?: Record<string, unknown>[]
  } | null
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

function focusRecord(trace: BoardTrace, hit: XrayHit) {
  const body = trace.body
  if (!body) return null
  if (hit.query === 'columns') {
    const column = body.columns?.find(item => item.id === hit.rowId)
    if (!column) return null
    return { id: column.id, title: column.title, state: column.state }
  }
  if (hit.query === 'tasks') {
    for (const column of body.columns ?? []) {
      const task = column.tasks?.find(item => item.id === hit.rowId)
      if (task) return task
    }
  }
  if (hit.query === 'blockers') {
    return body.blockers?.find(item => item.id === hit.rowId) ?? null
  }
  return null
}

export function buildStory(hit: XrayHit, trace: BoardTrace, sources: Record<string, Snippet>): StoryLayer[] {
  const query = trace.queries.find(item => item.name === hit.query)
  const row = query?.rows.find(item => String(item.id) === hit.rowId) ?? null
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
      sentence: 'A Vue file has a template. {{ }} prints one field of the object the component was given.',
      snippet: sources[hit.snippets.template]
    },
    {
      layer: 'vue',
      name: 'Vue',
      title: 'The page asked for the board',
      sentence: 'The page does not contain the tasks. useFetch calls the server and keeps the JSON.',
      snippet: sources[hit.snippets.fetch]
    },
    {
      layer: 'network',
      name: 'Network',
      title: `${trace.method} ${trace.path}`,
      sentence: 'The browser and the server are two programs. This is the object the server sent for the thing you clicked. The marked field is that value.',
      record: focusRecord(trace, hit),
      focus: hit.field
    },
    {
      layer: 'server',
      name: 'Server',
      title: 'The route handler',
      sentence: 'A file under server/api becomes a URL. This function ran for the request.',
      snippet: sources[hit.snippets.handler]
    },
    {
      layer: 'database',
      name: 'Database',
      title: 'The statement that ran',
      sentence: query
        ? (query.params.length
            ? `SQLite ran this in ${query.ms} ms. Each ? is a parameter, listed under the statement.`
            : `SQLite ran this in ${query.ms} ms. This statement has no parameters.`)
        : 'This request did not record a statement for that name.',
      sql: query?.sql,
      params: query?.params ?? []
    },
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
