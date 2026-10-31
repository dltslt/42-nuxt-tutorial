// GET /api/me refuses the request when the session cookie is missing or does not open.
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = { id: String(session.user.id), name: String(session.user.name) }
  if (event.context.trace) event.context.trace.body = { user }
  return { user }
})
