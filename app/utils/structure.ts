import type { XrayHit } from '../composables/useXray'
import { fileOf, instanceOf, isOurs, nameOf, type Instance } from './vueTree'

export type Place = { file: string, line: number }

export type StructureStep = {
  kind: 'route' | 'app' | 'layout' | 'page' | 'component' | 'library' | 'loop' | 'element' | 'built'
  title: string
  sentence: string
  code?: string
  place?: Place
  props?: Record<string, unknown>
  names?: string[]
  link?: XrayHit
}

// Props that hold one row, the marked template line that prints its title, and the request that loaded it.
const rowProps: Record<string, { query: string, template: string, fetch: string, handler: string }> = {
  task: { query: 'tasks', template: 'task-title', fetch: 'board-fetch', handler: 'board-handler' }
}

function handlerFor(fetch: string, fallback: string) {
  if (fetch === 'create-fetch') return 'create-handler'
  if (fetch === 'move-fetch') return 'move-handler'
  return fallback
}

function rowLink(props: Record<string, unknown>, traces: Record<string, string>, origins: Record<string, string>): XrayHit | undefined {
  for (const [name, target] of Object.entries(rowProps)) {
    const row = props[name] as { id?: string, title?: string } | undefined
    if (!row?.id || !row.title) continue
    const fetch = origins[row.id] ?? target.fetch
    return {
      words: row.title,
      rowId: row.id,
      field: 'title',
      query: target.query,
      traceId: traces[fetch] ?? '',
      snippets: { template: target.template, fetch, handler: handlerFor(fetch, target.handler) }
    }
  }
  return undefined
}

function placeOf(value: string | null): Place | undefined {
  if (!value) return undefined
  const [file, line] = value.split(':')
  return { file: file!, line: Number(line) }
}

// Nuxt names an auto-imported component after its path under components/.
export function autoName(file: string) {
  const parts = file.replace(/^app\/components\//, '').replace(/\.vue$/, '').split('/')
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

function chainOf(el: Element) {
  const chain: Instance[] = []
  let instance = instanceOf(el)
  while (instance) {
    chain.unshift(instance)
    instance = instance.parent
  }
  return chain
}

function loopsInside(el: Element, owner: Instance) {
  const loops: Element[] = []
  let node: Element | null = el
  while (node) {
    if (node.hasAttribute('data-xray-for') && instanceOf(node) === owner) loops.unshift(node)
    node = node.parentElement
  }
  return loops
}

function loopStep(loop: Element): StructureStep {
  const expression = loop.getAttribute('data-xray-for')!
  const loc = loop.getAttribute('data-xray-loc')
  const siblings = Array.from(loop.parentElement?.children ?? []).filter(item => item.getAttribute('data-xray-loc') === loc)
  const [item, list] = expression.split(/\s+in\s+/)
  return {
    kind: 'loop',
    title: `v-for="${expression}"`,
    sentence: `This element is written once in the template. Vue repeats it for every entry of ${list}, like a for loop over an array, with ${item} as the loop variable. This is copy ${siblings.indexOf(loop) + 1} of ${siblings.length}.`,
    place: placeOf(loc)
  }
}

function componentStep(instance: Instance, usedAt: string | null, traces: Record<string, string>, origins: Record<string, string>): StructureStep {
  const file = fileOf(instance)
  if (file === 'app/app.vue') {
    return {
      kind: 'app',
      title: 'app/app.vue',
      sentence: 'The outermost component. Every screen of the app is drawn inside it, like main() calling everything else.',
      place: { file, line: 1 }
    }
  }
  if (file.startsWith('app/layouts/')) {
    return {
      kind: 'layout',
      title: file,
      sentence: 'A layout is the frame around pages: header, chapter list, X-ray column. <NuxtLayout> in app.vue picks it; default.vue is used unless a page asks for another.',
      place: { file, line: 1 }
    }
  }
  if (file.startsWith('app/pages/')) {
    return {
      kind: 'page',
      title: file,
      sentence: 'A page is a component that a URL selects. <NuxtPage> in app.vue puts it here. The page also fetches the data the components below it receive.',
      place: { file, line: 1 }
    }
  }
  const name = autoName(file)
  return {
    kind: 'component',
    title: `<${name}> from ${file}`,
    sentence: `A component is a reusable piece of template with its own inputs, called props, like a function's parameters. Nobody imports it: Nuxt finds ${file} and makes it available everywhere as <${name}>. The parent passed these props:`,
    props: { ...instance.props },
    link: rowLink(instance.props, traces, origins),
    place: placeOf(usedAt) ?? { file, line: 1 }
  }
}

// A component that comes from a module, used by our template.
function libraryStep(instances: Instance[], el: Element): StructureStep {
  const names = instances.map(nameOf)
  const usedAt = placeOf(el.closest('[data-xray-use]')?.getAttribute('data-xray-use') ?? null)
  return {
    kind: 'library',
    title: names.join(' › '),
    sentence: 'This part is drawn by a component from a module, not by a file in this project. @nuxt/ui ships components like UBadge; installing the module made them usable everywhere. Its code is in node_modules; what we wrote is the line that uses it:',
    names,
    place: usedAt
  }
}

export function buildStructure(el: Element, route: { path: string }, fromServer: boolean | null, traces: Record<string, string>, origins: Record<string, string>): StructureStep[] {
  const steps: StructureStep[] = []
  const chain = chainOf(el)
  const page = chain.find(instance => fileOf(instance).startsWith('app/pages/'))
  if (page) {
    steps.push({
      kind: 'route',
      title: `URL ${route.path}`,
      sentence: `Nuxt turns every file under app/pages/ into a URL. ${fileOf(page)} became ${route.path}. Nobody wrote a routing table; the file name is the route.`
    })
  }

  // Library components between two of ours are folded into one step.
  let library: Instance[] = []
  for (const instance of chain) {
    if (!isOurs(instance)) {
      library.push(instance)
      continue
    }
    // Wrappers like NuxtLayout and RouterView sit between our files; they are plumbing, not the lesson.
    library = []
    const root = instance.subTree.el as Element | null
    steps.push(componentStep(instance, root instanceof Element ? root.getAttribute('data-xray-use') : null, traces, origins))
    for (const loop of loopsInside(el, instance)) steps.push(loopStep(loop))
  }
  if (library.length) steps.push(libraryStep(library, el))

  const loc = el.getAttribute('data-xray-loc') ?? (library.length ? null : el.closest('[data-xray-loc]')?.getAttribute('data-xray-loc') ?? null)
  const classes = Array.from(el.classList)
  if (!library.length) {
    steps.push({
      kind: 'element',
      title: `<${el.tagName.toLowerCase()}>`,
      sentence: classes.length
        ? 'The element in the template. Its look comes from the class list: each Tailwind class is one CSS rule, so text-sm sets the font size and p-3 the padding.'
        : 'The element in the template. It has no classes, so it looks the way the browser and its parent style it.',
      code: classes.join(' '),
      place: placeOf(loc)
    })
  }

  if (fromServer !== null) {
    steps.push({
      kind: 'built',
      title: fromServer ? 'Built on the server' : 'Built in the browser',
      sentence: fromServer
        ? 'This element was already in the HTML the server sent. The server ran these same components to write that HTML. Vue in the browser then took over the existing element instead of making a new one; this is called hydration.'
        : 'This element was not in the HTML the server sent. Vue created it in the browser, after the page had loaded.'
    })
  }
  return steps
}
