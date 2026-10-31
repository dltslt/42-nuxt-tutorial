// Server middleware runs before the route handler for every request.
// beginTrace is auto-imported from server/utils. There is no import line.
export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/') || event.path.startsWith('/api/_xray')) return
  const trace = beginTrace(event)
  setHeader(event, 'x-trace-id', trace.id)
})
