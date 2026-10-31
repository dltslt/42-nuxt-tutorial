// POST /api/login checks one actor and seals a session cookie.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = typeof body?.id === 'string' ? body.id.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!id || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Name and password are required' })
  }

  // The hash is read on a separate statement so the trace rows do not contain it.
  const actors = await query(event, 'actors')`SELECT id, name FROM actors WHERE id = ${id}`
  const actor = actors[0]
  const secret = await useDatabase().sql`SELECT password_hash FROM actors WHERE id = ${id}`
  const hash = String(secret.rows?.[0]?.password_hash ?? '')
  const ok = Boolean(actor && hash && await verifyPassword(hash, password))
  if (!actor || !ok) {
    throw createError({ statusCode: 401, statusMessage: 'Unknown name or password' })
  }

  const user = { id: String(actor.id), name: String(actor.name) }
  await setUserSession(event, { user })
  if (event.context.trace) event.context.trace.body = { user }
  return { user }
})
