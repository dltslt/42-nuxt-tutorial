<script setup lang="ts">
const pairs = [
  {
    id: 'make',
    c: 'Makefile',
    web: 'package.json',
    cText: 'A target is a name and a recipe. In this tutorial, `make dev` runs `pnpm exec nuxt dev --port 3042`.',
    webText: '`package.json` stores those recipes under `scripts`, and the libraries under `dependencies`. `nuxt.config.ts` then names the modules Nuxt should load.'
  },
  {
    id: 'main',
    c: 'main',
    web: 'the server start',
    cText: 'A C program begins at `main`. After that, your code decides when to call `listen`.',
    webText: '`nuxt dev` starts Node. Nuxt reads `nuxt.config.ts`, Nitro listens on port 3042, and `server/plugins/seed.ts` runs once before the first request. `app/app.vue` is the root of the page inside that process.'
  },
  {
    id: 'header',
    c: '#include',
    web: 'import',
    cText: '`#include` inserts a header into the file the compiler is reading. The linker matches those declarations to object files afterwards.',
    webText: '`import` names a module. Vite finds that file while it builds the page. The `modules` array in `nuxt.config.ts` lists `@nuxt/ui` and `modules/xray/`, which run as part of that build.'
  }
]
</script>

<template>
  <section class="mt-10" aria-labelledby="mapping-title">
    <h2 id="mapping-title" class="text-lg font-semibold tracking-tight text-highlighted">The same jobs, in other files</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Each card is one job from C, and the file that does it in this app.
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <article v-for="pair in pairs" :key="pair.id" class="pair-card">
        <h3 class="pair-names">
          <span>{{ pair.c }}</span>
          <span>becomes</span>
          <span>{{ pair.web }}</span>
        </h3>
        <p><InlineText :text="pair.cText" /></p>
        <p><InlineText :text="pair.webText" /></p>
      </article>
    </div>
  </section>
</template>
