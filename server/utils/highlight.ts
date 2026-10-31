import { createHighlighter } from 'shiki'

const highlighter = createHighlighter({
  themes: ['github-light', 'kanagawa-dragon'],
  langs: ['vue', 'vue-html', 'ts', 'sql', 'json']
})

export async function highlight(code: string, lang: string, focusLine?: number) {
  const engine = await highlighter
  const safeLang = engine.getLoadedLanguages().includes(lang) ? lang : 'ts'
  return engine.codeToHtml(code, {
    lang: safeLang,
    themes: { light: 'github-light', dark: 'kanagawa-dragon' },
    defaultColor: false,
    transformers: focusLine
      ? [{ line(node, line) { if (line === focusLine) this.addClassToHast(node, 'focus') } }]
      : []
  })
}
