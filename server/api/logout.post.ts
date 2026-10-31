// POST /api/logout drops the sealed session cookie.
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  if (event.context.trace) event.context.trace.body = { user: null }
  return { user: null }
})
