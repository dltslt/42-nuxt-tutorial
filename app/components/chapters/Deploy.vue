<script setup lang="ts">
type OutputEntry = { path: string, kind: 'file' | 'dir' }
type OutputBody = { present: boolean, entries: OutputEntry[] }

const step = ref(0)
const steps = [
  {
    title: 'Nuxt reads the app',
    layer: 'server',
    sentence: '`make build` starts from `nuxt.config.ts`, `app/pages/`, and `server/api/`. It writes files. It does not answer requests while it does that.'
  },
  {
    title: 'The client is bundled',
    layer: 'browser',
    sentence: 'The Vue pages become files under `.output/public/`. The browser downloads those. It does not download `app/pages/sample.vue`.'
  },
  {
    title: 'The server is bundled',
    layer: 'server',
    sentence: 'Nitro writes `.output/server/index.mjs`. That file is the production process. The route handlers and the seed plugin are inside it.'
  },
  {
    title: 'Preview serves the build',
    layer: 'network',
    sentence: '`make preview` runs that server on port 3042. A change to a `.vue` file stays invisible until the next `make build`. `make dev` is the process that rebuilds as you edit.'
  }
]

const targets = [
  {
    id: 'ssr',
    name: 'SSR site',
    where: 'this app',
    text: '`nuxt build` keeps the first render on the server. The response is HTML, and then the browser hydrates it. `make preview` runs that server.',
    sampleText: 'These two commands write `.output/` and then serve it. The dev server is a different process.',
    sample: `make build
make preview`
  },
  {
    id: 'spa',
    name: 'SPA',
    where: 'the browser',
    text: '`ssr: false` in `nuxt.config.ts` skips server HTML. The browser renders the first page. `nuxt generate` can write a static tree for a host that has no Node process.',
    sampleText: 'This is the switch. It is not set in this app, so the first response stays HTML from Node.',
    sample: `export default defineNuxtConfig({
  ssr: false
})`
  },
  {
    id: 'pwa',
    name: 'PWA',
    where: 'explained',
    text: 'A module can add a service worker and a manifest, so the site can install and work offline. This tutorial does not add one.',
    sampleText: 'An example only. `@vite-pwa/nuxt` is not in `package.json`.',
    sample: `export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt']
})`
  },
  {
    id: 'desktop',
    name: 'Desktop',
    where: 'explained',
    text: 'A wrapper such as Tauri or Electron can open the built client in a native window. This tutorial does not add a wrapper.',
    sampleText: 'The wrapper is a separate project. It loads the built client. Nothing in this repository starts one.',
    sample: `tauri dev`
  },
  {
    id: 'mobile',
    name: 'Mobile',
    where: 'explained',
    text: 'A wrapper such as Capacitor loads the built client in a phone web view. This tutorial does not add one.',
    sampleText: 'Same idea as the desktop wrapper. The page is still the Nuxt client.',
    sample: `npx cap open android`
  },
  {
    id: 'docker',
    name: 'Docker',
    where: 'explained',
    text: 'ft_transcendence ships a container. The image runs `node .output/server/index.mjs`, sets `NUXT_APP_SECRET`, and keeps the SQLite file on a volume. This tutorial does not include a Dockerfile.',
    sampleText: 'A production image copies `.output/` and starts the server. Port 3000 is the Nitro default. `make preview` uses 3042 instead.',
    sample: `FROM node:22
WORKDIR /app
COPY .output .output
ENV NUXT_APP_SECRET=replace-me
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]`
  }
]

const { data, refresh, status } = await useFetch<OutputBody>('/api/output')

const chosen = ref(targets[0]!.id)
const currentStep = computed(() => steps[step.value]!)
const current = computed(() => targets.find(target => target.id === chosen.value)!)
const output = computed(() => data.value ?? { present: false, entries: [] })

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), steps.length - 1)
}
</script>

<template>
  <section class="mt-8" aria-labelledby="build-steps-title">
    <h2 id="build-steps-title" class="text-lg font-semibold tracking-tight text-highlighted">What make build writes</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The source stays in the repository. The running production app is the folder the build creates.
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of one production build">
        <li v-for="(item, index) in steps" :key="item.title" class="flex-1">
          <button
            type="button"
            class="h-2 w-full rounded-full bg-accented"
            :style="index === step ? { background: `var(--layer-${item.layer})` } : undefined"
            :aria-current="index === step ? 'step' : undefined"
            :aria-label="`${index + 1}. ${item.title}`"
            @click="go(index)"
          />
        </li>
      </ol>
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step >= steps.length - 1" @click="go(step + 1)">
        Next
      </button>
    </div>
    <article
      class="layer-card mt-4 p-3"
      :style="{ borderLeftColor: `var(--layer-${currentStep.layer})`, background: `var(--layer-${currentStep.layer}-bg)` }"
    >
      <h3 class="text-sm font-semibold">{{ currentStep.title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-pretty"><InlineText :text="currentStep.sentence" /></p>
    </article>
    <p class="sr-only" aria-live="polite">{{ currentStep.title }}. {{ currentStep.sentence.replaceAll('`', '') }}</p>
  </section>

  <section class="mt-10" aria-labelledby="output-title">
    <h2 id="output-title" class="text-lg font-semibold tracking-tight text-highlighted">The folder on disk</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="`GET /api/output` reads `.output/` and stops after `server/` and `public/`. It does not open the files." />
    </p>
    <button
      type="button"
      class="mt-3 rounded-md px-3 py-2 text-sm ring ring-default"
      :disabled="status === 'pending'"
      :aria-busy="status === 'pending'"
      @click="refresh()"
    >
      {{ status === 'pending' ? 'Reading…' : 'Read .output/ again' }}
    </button>
    <p v-if="status === 'success' && !output.present" class="mt-4 text-sm leading-relaxed text-pretty">
      <InlineText text="This folder is not on disk yet. `make build` creates it. Read it again when the command finishes." />
    </p>
    <ul v-else-if="output.present" class="mt-4 max-w-xl space-y-1 text-sm" aria-label="Entries in .output">
      <li v-for="entry in output.entries" :key="entry.path" class="flex gap-3">
        <span class="min-w-0 font-mono text-xs">{{ entry.path }}</span>
        <span class="text-muted">{{ entry.kind === 'dir' ? 'directory' : 'file' }}</span>
      </li>
    </ul>
  </section>

  <section class="mt-10" aria-labelledby="targets-title">
    <h2 id="targets-title" class="text-lg font-semibold tracking-tight text-highlighted">What can be built</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      This app is a server-rendered site. The other shapes are possible. Only the first one is built here.
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <label v-for="target in targets" :key="target.id" class="pair-card">
        <input v-model="chosen" type="radio" name="build-target" :value="target.id">
        <span class="pair-names">
          <span>{{ target.name }}</span>
          <span>is</span>
          <span>{{ target.where }}</span>
        </span>
        <p><InlineText :text="target.text" /></p>
      </label>
    </div>
    <p class="sr-only" aria-live="polite">{{ current.name }}. {{ current.text.replaceAll('`', '') }}</p>
    <article class="mt-4">
      <h3 id="target-sample" class="text-sm font-semibold text-highlighted">{{ current.name }}</h3>
      <p class="mt-1 text-sm leading-relaxed text-pretty text-muted"><InlineText :text="current.sampleText" /></p>
      <div class="sample mt-2" tabindex="0" role="region" aria-labelledby="target-sample">
        <pre><code>{{ current.sample }}</code></pre>
      </div>
    </article>
  </section>
</template>
