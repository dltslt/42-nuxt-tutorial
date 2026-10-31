import { relative } from 'node:path'

type Loc = { start: { line: number, column: number }, source: string }
type Attr = { type: number, name: string, value?: { type: number, content: string, loc: Loc }, loc: Loc, nameLoc?: Loc }
type ElementNode = { type: number, tag: string, tagType: number, loc: Loc, props: Attr[] }
type Context = { filename: string }

const NODE_ELEMENT = 1
const TAG_ELEMENT = 0
const TAG_COMPONENT = 1
const PROP_ATTRIBUTE = 6

// These render no element of their own, so an attribute on them has nowhere to land.
const wrappers = new Set(['ClientOnly', 'NuxtLayout', 'NuxtPage', 'Teleport', 'Transition', 'TransitionGroup', 'KeepAlive', 'Suspense', 'component'])

function attribute(name: string, content: string, loc: Loc): Attr {
  return { type: PROP_ATTRIBUTE, name, nameLoc: loc, value: { type: 2, content, loc }, loc }
}

// A Vue compiler transform runs on every template node while a .vue file is compiled.
// It stamps elements and components used in app/ with their source line, so the browser can point back at the template.
export function locate(rootDir: string) {
  return (node: ElementNode, context: Context) => {
    if (node.type !== NODE_ELEMENT) return
    if (node.tagType !== TAG_ELEMENT && node.tagType !== TAG_COMPONENT) return
    if (node.tagType === TAG_COMPONENT && wrappers.has(node.tag)) return
    const file = relative(rootDir, context.filename ?? '')
    if (!file.startsWith('app/')) return
    const { line, column } = node.loc.start
    // On a component the attribute falls through to its root element, so it gets its own name.
    const name = node.tagType === TAG_COMPONENT ? 'data-xray-use' : 'data-xray-loc'
    node.props.push(attribute(name, `${file}:${line}:${column}`, node.loc))
    // Vue's own v-for transform has already removed the directive, so read it from the opening tag.
    const loop = node.loc.source.match(/^<[^>]*?\sv-for="([^"]+)"/)
    if (loop) node.props.push(attribute('data-xray-for', loop[1], node.loc))
  }
}
