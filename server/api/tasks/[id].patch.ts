// tasks/[id].patch.ts becomes PATCH /api/tasks/:id. The [id] segment is the row to move.
export default defineEventHandler(async (event) => {
  // xray:move-handler
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const columnId = typeof body?.column_id === 'string' ? body.column_id : ''
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing task' })

  const columns = await query(event, 'column')`
    SELECT id, state FROM columns WHERE id = ${columnId}
  `
  const column = columns[0]
  if (!column) throw createError({ statusCode: 400, statusMessage: 'That column does not exist' })

  await query(event, 'move-task')`
    UPDATE tasks SET column_id = ${column.id}, state = ${column.state} WHERE id = ${id}
  `
  const tasks = await readTask(event, id)
  if (!tasks.length) throw createError({ statusCode: 404, statusMessage: 'No task with that id' })

  const payload = { tasks }
  if (event.context.trace) event.context.trace.body = payload
  return payload
  // /xray:move-handler
})
