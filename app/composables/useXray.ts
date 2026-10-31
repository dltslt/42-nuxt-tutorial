export type XrayHit = {
  words: string
  rowId: string
  field: string
  query: string
  traceId: string
  snippets: {
    template: string
    fetch: string
    handler: string
  }
}

// One id per fetch marker. Call this from setup, then write the id when that response arrives.
export function useTraceIds() {
  return useState<Record<string, string>>('xray-trace-ids', () => ({}))
}

export function rememberTrace(ids: Record<string, string>, marker: string, id: string | null) {
  if (!id || ids[marker] === id) return ids
  return { ...ids, [marker]: id }
}

export type XrayElement = HTMLElement & { _xrayHit?: XrayHit }

// DOM elements cannot go into the SSR payload, so the selection lives in plain refs set only in the browser.
const hovered = shallowRef<XrayElement | null>(null)
const pinned = shallowRef<XrayElement | null>(null)
const dataHit = shallowRef<XrayHit | null>(null)

export function useXray() {
  const enabled = useState('xray-enabled', () => false)

  const selected = computed(() => pinned.value ?? hovered.value)
  const hit = computed(() => dataHit.value ?? selected.value?._xrayHit ?? null)
  const view = computed<'data' | 'structure' | 'empty'>(() => {
    if (hit.value) return 'data'
    return selected.value ? 'structure' : 'empty'
  })

  function hover(el: XrayElement | null) {
    if (pinned.value) return
    dataHit.value = null
    hovered.value = el
  }

  function pin(el: XrayElement | null) {
    dataHit.value = null
    pinned.value = el
    if (!el) hovered.value = null
  }

  // A structure step can open the data chain of a row it was given; that also pins the element.
  function showData(value: XrayHit | null) {
    if (value && !pinned.value) pinned.value = hovered.value
    dataHit.value = value
  }

  const followed = computed(() => dataHit.value !== null)

  return { enabled, hovered, pinned, selected, hit, view, followed, hover, pin, showData }
}
