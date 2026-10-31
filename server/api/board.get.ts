// A file named board.get.ts becomes GET /api/board.
export default defineEventHandler(async (event) => {
  // xray:board-handler
  const columns = await query(event, 'columns')`
    SELECT id, title, state, position
    FROM columns
    ORDER BY position
  `
  const tasks = await query(event, 'tasks')`
    SELECT
      tasks.id,
      tasks.title,
      tasks.level,
      tasks.state,
      tasks.column_id,
      leads.name AS lead,
      parents.title AS parent_title
    FROM tasks
    LEFT JOIN actors AS leads ON leads.id = tasks.lead
    LEFT JOIN tasks AS parents ON parents.id = tasks.parent_id
    ORDER BY tasks.title
  `
  const blockers = await query(event, 'blockers')`
    SELECT
      blockers.id,
      blockers.severity,
      blocker.title AS blocker_title,
      blocked.title AS blocked_title
    FROM blockers
    JOIN tasks AS blocker ON blocker.id = blockers.blocker_item_id
    JOIN tasks AS blocked ON blocked.id = blockers.blocked_item_id
  `

  const body = {
    columns: columns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.column_id === column.id)
    })),
    blockers
  }
  if (event.context.trace) event.context.trace.body = body
  return body
  // /xray:board-handler
})
