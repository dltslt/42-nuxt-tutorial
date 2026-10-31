import { relative } from 'node:path'

type Loc = { start: { line: number, column: number } }
type Attr = { type: number, name: string, value?: { type: number, content: string, loc: Loc }, loc: Loc, nameLoc?: Loc }
type Directive = { type: number, name: string, exp?: { content: string } }
type ElementNode = { type: number, tagType: number, loc: Loc, props: Array<Attr | Directive> }
type Context = { filename: string }

const NODE_ELEMENT = 1
const TAG_ELEMENT = 0
const PROP_ATTRIBUTE = 6
const PROP_DIRECTIVE = 7

function attribute(name: string, content: string, loc: Loc): Attr {
  return { type: PROP_ATTRIBUTE, name, nameLoc: loc, value: { type: 2, content, loc }, loc }
}

// A Vue compiler transform runs on every template node while a .vue file is compiled.
// It stamps plain elements in app/ with their source line, so the browser can point back at the template.
export function locate(rootDir: string) {
  return (node: ElementNode, context: Context) => {
    if (node.type !== NODE_ELEMENT || node.tagType !== TAG_ELEMENT) return
    const file = relative(rootDir, context.filename ?? '')
    if (!file.startsWith('app/')) return
    const { line, column } = node.loc.start
    node.props.push(attribute('data-xray-loc', `${file}:${line}:${column}`, node.loc))
    const loop = node.props.find(prop => prop.type === PROP_DIRECTIVE && prop.name === 'for') as Directive | undefined
    if (loop?.exp) node.props.push(attribute('data-xray-for', loop.exp.content, node.loc))
  }
}
