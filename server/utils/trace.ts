import type { H3Event } from 'h3'

export type QueryTrace = {
  name: string
  sql: string
  params: unknown[]
  rows: Record<string, unknown>[]
  ms: number
}

export type Trace = {
  id: string
  method: string
  path: string
  queries: QueryTrace[]
  body: unknown
}

const traces = new Map<string, Trace>()

export function beginTrace(event: H3Event) {
  const trace: Trace = {
    id: crypto.randomUUID(),
    method: event.method,
    path: event.path,
    queries: [],
    body: null
  }
  event.context.trace = trace
  traces.set(trace.id, trace)
  while (traces.size > 40) {
    const oldest = traces.keys().next().value
    if (!oldest) break
    traces.delete(oldest)
  }
  return trace
}

export function readTrace(id: string) {
  return traces.get(id) ?? null
}

declare module 'h3' {
  interface H3EventContext {
    trace?: Trace
  }
}
