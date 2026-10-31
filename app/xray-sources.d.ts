declare module '#xray-sources' {
  const snippets: Record<string, {
    name: string
    file: string
    start: number
    end: number
    code: string
  }>
  export default snippets
}
