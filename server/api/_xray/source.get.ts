import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

const longest = 40

// The lines of one element: from its opening tag to the closing tag at the same indent.
function elementLines(lines: string[], start: number) {
  const first = lines[start] ?? ''
  const indent = first.match(/^\s*/)![0]
  const tag = first.trim().match(/^<([\w-]+)/)?.[1]
  if (!tag || new RegExp(`</${tag}>|/>\\s*$`).test(first)) return start
  for (let index = start + 1; index < Math.min(lines.length, start + longest); index++) {
    const line = lines[index]!
    if (line.startsWith(`${indent}</${tag}>`) || line === `${indent}/>`) return index
  }
  return Math.min(lines.length - 1, start + longest - 1)
}

export default defineEventHandler(async (event) => {
  const { file, line } = getQuery(event) as { file?: string, line?: string }
  const appDir = resolve('app')
  const path = resolve(String(file ?? ''))
  if (!file || !path.startsWith(appDir + sep) || !path.endsWith('.vue')) {
    throw createError({ statusCode: 400, statusMessage: 'Only .vue files under app/ can be read.' })
  }
  const lines = (await readFile(path, 'utf8')).split('\n')
  const start = Math.max(0, Number(line) - 1)
  const end = elementLines(lines, start)
  const from = Math.max(0, start - 2)
  const code = lines.slice(from, end + 1).join('\n')
  return {
    file,
    start: from + 1,
    focus: start + 1,
    end: end + 1,
    html: await highlight(code, 'vue-html', start - from + 1)
  }
})
