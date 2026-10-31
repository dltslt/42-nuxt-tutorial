// server/api/tables.get.ts becomes GET /api/tables.
// The table name arrives as a query parameter and is checked against this list.
// It is never pasted into the SQL text.
const tables = ['actors', 'columns', 'tasks', 'blockers'] as const

type TableName = typeof tables[number]

function isTable(value: unknown): value is TableName {
  return typeof value === 'string' && tables.includes(value as TableName)
}

export default defineEventHandler(async (event) => {
  const requested = getQuery(event).table
  if (!isTable(requested)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown table' })
  }

  if (requested === 'actors') {
    const rows = await query(event, 'actors')`SELECT id, name FROM actors ORDER BY name`
    return { table: requested, columns: ['id', 'name'], rows }
  }
  if (requested === 'columns') {
    const rows = await query(event, 'columns')`SELECT id, title, state, position FROM columns ORDER BY position`
    return { table: requested, columns: ['id', 'title', 'state', 'position'], rows }
  }
  if (requested === 'tasks') {
    const rows = await query(event, 'tasks')`
      SELECT id, title, level, column_id, state, lead, parent_id
      FROM tasks
      ORDER BY title
    `
    return { table: requested, columns: ['id', 'title', 'level', 'column_id', 'state', 'lead', 'parent_id'], rows }
  }

  const rows = await query(event, 'blockers')`
    SELECT id, blocker_item_id, blocked_item_id, severity
    FROM blockers
  `
  return { table: requested, columns: ['id', 'blocker_item_id', 'blocked_item_id', 'severity'], rows }
})
