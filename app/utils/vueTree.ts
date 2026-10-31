// Vue's dev build attaches the component instance that rendered each element.
// These helpers read that link; the fields are dev-only and absent in a production build.

export type Instance = {
  uid: number
  type: { __name?: string, name?: string, __file?: string }
  props: Record<string, unknown>
  parent: Instance | null
  vnode: { el: Node | null }
  subTree: { el: Node | null }
}

export function instanceOf(el: Element | null): Instance | null {
  return (el as (Element & { __vueParentComponent?: Instance }) | null)?.__vueParentComponent ?? null
}

export function fileOf(instance: Instance) {
  const file = instance.type.__file ?? ''
  const at = file.lastIndexOf('/app/')
  if (at >= 0 && !file.includes('/node_modules/')) return file.slice(at + 1)
  return file
}

export function isOurs(instance: Instance) {
  return fileOf(instance).startsWith('app/')
}

export function nameOf(instance: Instance) {
  if (instance.type.__name) return instance.type.__name
  if (instance.type.name) return instance.type.name
  const file = fileOf(instance)
  return file ? file.split('/').pop()!.replace(/\.vue$/, '') : 'Anonymous'
}

// The selected element first, then each enclosing element worth naming: roots of our components and loop items.
export function crumbsFor(el: Element) {
  const crumbs: Element[] = [el]
  let node = el.parentElement
  while (node && node !== document.body) {
    const instance = instanceOf(node)
    const isRoot = instance && instance.subTree.el === node && isOurs(instance)
    if (isRoot || node.hasAttribute('data-xray-for')) crumbs.push(node)
    node = node.parentElement
  }
  return crumbs
}

export function labelFor(el: Element) {
  const tag = `<${el.tagName.toLowerCase()}>`
  const instance = instanceOf(el)
  if (!instance) return tag
  // The root element of a component is the component, as far as a reader is concerned.
  if (instance.subTree.el === el) return nameOf(instance)
  return `${tag} in ${nameOf(instance)}`
}
