export type XrayHit = {
  words: string
  rowId: string
  field: string
  query: string
  snippets: {
    template: string
    fetch: string
    handler: string
  }
}

export function useXray() {
  const enabled = useState('xray-enabled', () => false)
  const open = useState('xray-open', () => false)
  const hit = useState<XrayHit | null>('xray-hit', () => null)

  function inspect(value: XrayHit) {
    if (!enabled.value) return
    hit.value = value
    open.value = true
  }

  return { enabled, open, hit, inspect }
}
