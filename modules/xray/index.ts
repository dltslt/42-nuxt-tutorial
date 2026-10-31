import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

type Snippet = {
  name: string
  file: string
  start: number
  end: number
  code: string
}

const openMark = /(?:\/\/|<!--)\s*xray:([a-z0-9-]+)\s*(?:-->)?/
const closeMark = /(?:\/\/|<!--)\s*\/xray:([a-z0-9-]+)\s*(?:-->)?/

function filesUnder(dir: string, found: string[]) {
  let names: string[] = []
  try {
    names = readdirSync(dir)
  } catch {
    return
  }
  for (const name of names) {
    if (name === 'node_modules' || name === '.nuxt' || name === '.data') continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) filesUnder(path, found)
    else if (/\.(vue|ts|mjs)$/.test(name)) found.push(path)
  }
}

function scan(root: string) {
  const files: string[] = []
  filesUnder(join(root, 'app'), files)
  filesUnder(join(root, 'server'), files)
  const snippets: Record<string, Snippet> = {}
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n')
    let open: { name: string, start: number } | null = null
    lines.forEach((line, index) => {
      const close = line.match(closeMark)
      if (close && open && close[1] === open.name) {
        snippets[open.name] = {
          name: open.name,
          file: relative(root, file),
          start: open.start + 1,
          end: index,
          code: lines.slice(open.start, index).join('\n')
        }
        open = null
        return
      }
      const start = line.match(openMark)
      if (start && !open) open = { name: start[1], start: index + 1 }
    })
  }
  return snippets
}

export default defineNuxtModule({
  meta: { name: 'xray' },
  setup(_options, nuxt) {
    // A module runs at build time. addTemplate writes a file the app can import.
    const template = addTemplate({
      filename: 'xray-sources.mjs',
      getContents: () => `export default ${JSON.stringify(scan(nuxt.options.rootDir))}\n`
    })
    nuxt.options.alias['#xray-sources'] = template.dst
  }
})
