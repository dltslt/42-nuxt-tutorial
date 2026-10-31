// A file named tasks.post.ts becomes POST /api/tasks.
export default defineEventHandler(async (event) => {
  // xray:create-handler
  const body = await readBody(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const columnId = typeof body?.column_id === 'string' ? body.column_id : ''
  if (!title || title.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'A title is required' })
  }

  const columns = await query(event, 'column')`
    SELECT id, state FROM columns WHERE id = ${columnId}
  `
  const column = columns[0]
  if (!column) throw createError({ statusCode: 400, statusMessage: 'That column does not exist' })

  const id = crypto.randomUUID()
  await query(event, 'insert-task')`
    INSERT INTO tasks (id, title, level, column_id, state, lead, parent_id)
    VALUES (${id}, ${title}, 'task', ${column.id}, ${column.state}, NULL, NULL)
  `
  const tasks = await readTask(event, id)
  const payload = { tasks }
  if (event.context.trace) event.context.trace.body = payload
  return payload
  // /xray:create-handler
})
