export default defineEventHandler(async (event) => {
  const body = await readBody<{ blocks?: { id: string, code: string, lang: string }[] }>(event)
  const html: Record<string, string> = {}
  for (const block of body?.blocks ?? []) {
    html[block.id] = await highlight(block.code, block.lang)
  }
  return html
})
