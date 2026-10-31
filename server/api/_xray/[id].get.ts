export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const trace = id ? readTrace(id) : null
  if (!trace) {
    throw createError({ statusCode: 404, statusMessage: 'No trace for that id' })
  }
  return trace
})
