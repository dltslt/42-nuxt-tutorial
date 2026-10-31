<script setup lang="ts">
// The time is captured once on the server and reused from the payload.
// A client clock here would differ from the HTML and break hydration.
const writtenAt = useState('rendering-written-at', () => new Date().toISOString().slice(11, 19))
const attached = ref(false)
onMounted(() => {
  attached.value = true
})

const step = ref(0)
const steps = [
  {
    title: 'Node writes HTML',
    layer: 'server',
    sentence: 'Node runs the page, including its `useFetch`, and writes the result into HTML. The browser has not started Vue. On the sample, that HTML already contains the task titles.'
  },
  {
    title: 'The browser paints',
    layer: 'browser',
    sentence: 'The browser paints the HTML it received. The words are visible before the page script runs. A C program would still be inside `main` at the matching moment: the window exists, and the event loop has not started.'
  },
  {
    title: 'Vue hydrates',
    layer: 'vue',
    sentence: 'Vue walks the DOM that is already painted and attaches listeners. It does not build a second copy of the page. If the client render disagrees with that HTML, Vue reports a hydration mismatch.'
  },
  {
    title: 'A later click',
    layer: 'network',
    sentence: 'The next navigation stays in the browser. Vue requests JSON and patches the nodes that changed. Node does not send a new document.'
  }
]

const rules = [
  {
    id: 'ssr',
    name: 'SSR',
    text: 'No entry. Each request for `/rendering` runs the page on Node, and the response is HTML. This is the default, and it is what this tutorial does.',
    sample: `// nuxt.config.ts
// '/rendering' has no routeRules entry.`
  },
  {
    id: 'prerender',
    name: 'Prerender',
    text: '`nuxt build` writes the HTML for `/rendering` once. Later requests serve that file. A board that changes in SQLite stays frozen at the build.',
    sample: `routeRules: {
  '/rendering': { prerender: true }
}`
  },
  {
    id: 'spa',
    name: 'SPA',
    text: 'The response for `/rendering` is a shell. Vue builds the page in the browser after the script loads, so the first paint waits for that script.',
    sample: `routeRules: {
  '/rendering': { ssr: false }
}`
  }
]

const current = computed(() => steps[step.value]!)
const rule = ref(rules[0]!.id)
const chosen = computed(() => rules.find(item => item.id === rule.value)!)

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), steps.length - 1)
}
</script>

<template>
  <section class="mt-8" aria-labelledby="render-steps-title">
    <h2 id="render-steps-title" class="text-lg font-semibold tracking-tight text-highlighted">From the response to the page</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The sample page follows these steps on a fresh load. Step through it.
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of one render">
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
      :style="{ borderLeftColor: `var(--layer-${current.layer})`, background: `var(--layer-${current.layer}-bg)` }"
    >
      <h3 class="text-sm font-semibold">{{ current.title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-pretty"><InlineText :text="current.sentence" /></p>
    </article>
    <p class="sr-only" aria-live="polite">{{ current.title }}. {{ current.sentence.replaceAll('`', '') }}</p>
  </section>

  <section class="mt-8" aria-labelledby="render-live-title">
    <h2 id="render-live-title" class="text-lg font-semibold tracking-tight text-highlighted">This page, just now</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The time was written by Node. Reloading the document asks Node for a new one. Hydration keeps the time that is already here.
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <article class="layer-card p-3" :style="{ borderLeftColor: 'var(--layer-server)', background: 'var(--layer-server-bg)' }">
        <h3 class="text-sm font-semibold">In the HTML</h3>
        <p class="mt-2 font-mono text-sm">{{ writtenAt }} UTC</p>
      </article>
      <article class="layer-card p-3" :style="{ borderLeftColor: 'var(--layer-vue)', background: 'var(--layer-vue-bg)' }">
        <h3 class="text-sm font-semibold">After hydration</h3>
        <p class="mt-2 text-sm leading-relaxed text-pretty">
          <template v-if="attached">Vue has attached. The time did not change, and the document was not requested again.</template>
          <template v-else>Vue has not attached yet. This sentence is the one Node wrote.</template>
        </p>
      </article>
    </div>
  </section>

  <section class="mt-10" aria-labelledby="render-rules-title">
    <h2 id="render-rules-title" class="text-lg font-semibold tracking-tight text-highlighted"><code class="token">routeRules</code></h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="A path is the URL of one page. `app/pages/rendering.vue` is `/rendering`. The file name already chose that URL. `routeRules` in `nuxt.config.ts` chooses how the HTML for that URL is made. Pick one." />
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr))" role="radiogroup" aria-labelledby="render-rules-title">
      <label v-for="item in rules" :key="item.id" class="pair-card">
        <input v-model="rule" type="radio" name="route-rule" :value="item.id">
        <span class="pair-names">
          <span>{{ item.name }}</span>
        </span>
      </label>
    </div>
    <p class="sr-only" aria-live="polite">{{ chosen.name }}. {{ chosen.text.replaceAll('`', '') }}</p>
    <article class="mt-4">
      <h3 id="rule-sample" class="text-sm font-semibold text-highlighted">{{ chosen.name }}</h3>
      <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted"><InlineText :text="chosen.text" /></p>
      <div class="sample mt-2" tabindex="0" role="region" aria-labelledby="rule-sample">
        <pre><code>{{ chosen.sample }}</code></pre>
      </div>
    </article>
  </section>
</template>
