<script setup lang="ts">
const languages = [
  {
    id: 'ts',
    name: 'TypeScript',
    where: 'Node, before it runs',
    text: '`nuxt.config.ts` and the files under `server/` are TypeScript. The check happens before the file runs, and the types are gone afterwards. A C header works the same way: the compiler reads it, and the running program does not contain it.',
    sampleText: '`id` is a number and `column` is a string. Those annotations are gone once the file runs.',
    sample: `function place(id: number, column: string) {
  return { id, column }
}`
  },
  {
    id: 'sfc',
    name: 'Vue SFC',
    where: 'the page',
    text: 'A `.vue` file has a `script` block and a `template` block. The script becomes JavaScript. The template becomes the HTML that script fills. `app/pages/sample.vue` is one of these files.',
    sampleText: 'The script stores `title`. The template prints that value into the paragraph.',
    sample: `<script setup lang="ts">
const title = ref('Dinner')
${'</scr' + 'ipt>'}

<template>
  <p>{{ title }}</p>
</template>`
  },
  {
    id: 'css',
    name: 'CSS',
    where: 'the browser',
    text: '`app/assets/css/main.css` holds the layer colors. The browser applies those rules to the painted page. Node does not paint with them.',
    sampleText: 'A rule named `.task` sets a color. The browser applies it when it paints.',
    sample: `.task {
  color: var(--layer-ink);
}`
  },
  {
    id: 'sql',
    name: 'SQL',
    where: 'SQLite',
    text: '`server/plugins/seed.ts` creates the tables with SQL. Handlers under `server/api/` send more SQL through `query()`. SQLite runs that text. Node forwards it and reads the rows back.',
    sampleText: '`SELECT` asks SQLite for the `title` of one row in `tasks`.',
    sample: `SELECT title
FROM tasks
WHERE id = 1`
  },
  {
    id: 'wasm',
    name: 'WebAssembly',
    where: 'the browser',
    text: 'A C or C++ program can be compiled to WebAssembly and called from the page, beside JavaScript. Those bytes would run in the browser. This tutorial does not ship a `.wasm` file. The server stays Node, and the database stays SQLite.',
    sampleText: 'This function is C. Compiled, the page can call `add`.',
    sample: `int add(int left, int right) {
  return left + right;
}`
  }
]

const selected = ref(languages[0]!.id)
const current = computed(() => languages.find(language => language.id === selected.value)!)
</script>

<template>
  <section class="mt-8" aria-labelledby="languages-title">
    <h2 id="languages-title" class="text-lg font-semibold tracking-tight text-highlighted">Where each one runs</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Pick a language. The card says which process actually executes it.
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <label v-for="language in languages" :key="language.id" class="pair-card">
        <input v-model="selected" type="radio" name="language" :value="language.id">
        <span class="pair-names">
          <span>{{ language.name }}</span>
          <span>runs in</span>
          <span>{{ language.where }}</span>
        </span>
        <p><InlineText :text="language.text" /></p>
      </label>
    </div>
    <p class="sr-only" aria-live="polite">{{ current.name }}. {{ current.text.replaceAll('`', '') }}</p>
  </section>

  <section class="mt-10" aria-labelledby="samples-title">
    <h2 id="samples-title" class="text-lg font-semibold tracking-tight text-highlighted">A few lines of each</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      These are examples. They show the shape of each language.
    </p>
    <div class="mt-6 grid gap-6">
      <article v-for="language in languages" :key="language.id">
        <h3 :id="`sample-${language.id}`" class="text-sm font-semibold text-highlighted">{{ language.name }}</h3>
        <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
          <InlineText :text="language.sampleText" />
        </p>
        <div
          class="sample mt-2"
          tabindex="0"
          role="region"
          :aria-labelledby="`sample-${language.id}`"
        >
          <pre><code>{{ language.sample }}</code></pre>
        </div>
      </article>
    </div>
  </section>
</template>
