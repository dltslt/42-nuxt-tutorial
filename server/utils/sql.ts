import type { H3Event } from 'h3'

function statement(strings: TemplateStringsArray, values: unknown[]) {
  let sql = ''
  strings.forEach((part, index) => {
    sql += part
    if (index < values.length) sql += '?'
  })
  return sql.replace(/\s+/g, ' ').trim()
}

// query(event, name)`SELECT ...` runs the statement and keeps a copy on the request.
export function query(event: H3Event, name: string) {
  return async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const db = useDatabase()
    const started = performance.now()
    const result = await db.sql(strings, ...values)
    const rows = (result.rows ?? []) as Record<string, unknown>[]
    event.context.trace?.queries.push({
      name,
      sql: statement(strings, values),
      params: values,
      rows,
      ms: Math.round(performance.now() - started)
    })
    return rows
  }
}
