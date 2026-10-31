<script setup lang="ts">
const languages = [
  {
    id: 'ts',
    name: 'TypeScript',
    where: 'Node, before it runs',
    text: '`nuxt.config.ts` and the files under `server/` are TypeScript. The check happens before the file runs, and the types are gone afterwards. A C header works the same way: the compiler reads it, and the running program does not contain it.'
  },
  {
    id: 'sfc',
    name: 'Vue SFC',
    where: 'the page',
    text: 'A `.vue` file has a `script` block and a `template` block. The script becomes JavaScript. The template becomes the HTML that script fills. `app/pages/sample.vue` is one of these files.'
  },
  {
    id: 'css',
    name: 'CSS',
    where: 'the browser',
    text: '`app/assets/css/main.css` holds the layer colors. The browser applies those rules to the painted page. Node does not paint with them.'
  },
  {
    id: 'sql',
    name: 'SQL',
    where: 'SQLite',
    text: '`server/plugins/seed.ts` creates the tables with SQL. Handlers under `server/api/` send more SQL through `query()`. SQLite runs that text. Node forwards it and reads the rows back.'
  },
  {
    id: 'wasm',
    name: 'WebAssembly',
    where: 'the browser',
    text: 'A C or C++ program can be compiled to WebAssembly and called from the page, beside JavaScript. Those bytes would run in the browser. This tutorial does not ship a `.wasm` file. The server stays Node, and the database stays SQLite.'
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
</template>
