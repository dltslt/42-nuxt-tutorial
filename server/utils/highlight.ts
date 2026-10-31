import { createHighlighter } from 'shiki'

const highlighter = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['vue', 'ts', 'sql', 'json']
})

export async function highlight(code: string, lang: string) {
  const engine = await highlighter
  const safeLang = engine.getLoadedLanguages().includes(lang) ? lang : 'ts'
  return engine.codeToHtml(code, {
    lang: safeLang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false
  })
}
