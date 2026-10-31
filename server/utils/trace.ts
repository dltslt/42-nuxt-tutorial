import type { H3Event } from 'h3'

export type QueryTrace = {
  name: string
  sql: string
  params: unknown[]
  rows: Record<string, unknown>[]
  ms: number
}

export type SessionCookie = {
  name: string
  bytes: number
}

export type Trace = {
  id: string
  method: string
  path: string
  queries: QueryTrace[]
  body: unknown
  cookie: SessionCookie | null
}

// nuxt-auth-utils seals the user into this cookie. The trace keeps the name and the length.
const sessionCookieName = 'nuxt-auth-session'

function sessionCookie(event: H3Event): SessionCookie | null {
  const header = getRequestHeader(event, 'cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    if (trimmed.slice(0, eq) !== sessionCookieName) continue
    return { name: sessionCookieName, bytes: trimmed.length - eq - 1 }
  }
  return null
}

const traces = new Map<string, Trace>()

export function beginTrace(event: H3Event) {
  const trace: Trace = {
    id: crypto.randomUUID(),
    method: event.method,
    path: event.path,
    queries: [],
    body: null,
    cookie: sessionCookie(event)
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
