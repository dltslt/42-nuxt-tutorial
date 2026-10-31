<script setup lang="ts">
import sources from '#xray-sources'

type Marker = {
  name: string
  file: string
  start: number
  end: number
  code: string
}

const markers = Object.values(sources).sort((left, right) => left.name.localeCompare(right.name))
const selected = ref(markers[0]?.name ?? '')
const current = computed(() => markers.find(marker => marker.name === selected.value) ?? markers[0])

const step = ref(0)
const steps = [
  {
    title: 'Nuxt reads the config',
    layer: 'server',
    sentence: 'On startup Nuxt opens `nuxt.config.ts` and reads the `modules` array. Each entry is a package name or a path to a local folder.'
  },
  {
    title: 'setup() runs once',
    layer: 'server',
    sentence: 'A module is a function Nuxt calls at build time. `setup()` in `modules/xray/index.ts` runs before any request. A later click does not call it again.'
  },
  {
    title: 'It writes a module',
    layer: 'vue',
    sentence: '`addTemplate` writes a file under `.nuxt/`. This app imports that file as `#xray-sources`. The repository has no file with that name.'
  },
  {
    title: 'The server answers',
    layer: 'network',
    sentence: 'After `setup()` returns, Nitro listens. A request runs a route handler. It does not run the module again. Restarting `make dev` is what runs `setup()` once more.'
  }
]

const modules = [
  {
    id: 'ui',
    name: 'Nuxt UI',
    where: 'a package',
    text: '`@nuxt/ui` is named in `modules`. It registers components, so a template can use `UButton` and `USwitch` with no import line. The button below is one of those components.'
  },
  {
    id: 'xray',
    name: 'xray',
    where: 'a local folder',
    text: '`./modules/xray/index` is also in that array. A path works the same as a package name. This one scans the source for xray markers and writes the list in the next section.'
  }
]

const chosenModule = ref(modules[0]!.id)
const shown = computed(() => modules.find(item => item.id === chosenModule.value)!)
const currentStep = computed(() => steps[step.value]!)
const clicks = ref(0)

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), steps.length - 1)
}
</script>

<template>
  <section class="mt-8" aria-labelledby="module-steps-title">
    <h2 id="module-steps-title" class="text-lg font-semibold tracking-tight text-highlighted">When a module runs</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      A module is build-time code. It is closer to a step in a Makefile than to a function a request calls.
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of one module">
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

  <section class="mt-10" aria-labelledby="module-list-title">
    <h2 id="module-list-title" class="text-lg font-semibold tracking-tight text-highlighted">The two in this app</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Both are for this tutorial. Neither is a team decision.
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <label v-for="item in modules" :key="item.id" class="pair-card">
        <input v-model="chosenModule" type="radio" name="tutorial-module" :value="item.id">
        <span class="pair-names">
          <span>{{ item.name }}</span>
          <span>is</span>
          <span>{{ item.where }}</span>
        </span>
        <p><InlineText :text="item.text" /></p>
      </label>
    </div>
    <p class="sr-only" aria-live="polite">{{ shown.name }}. {{ shown.text.replaceAll('`', '') }}</p>
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <UButton label="Count a click" @click="clicks += 1" />
      <p class="text-sm text-muted">Clicked {{ clicks }} {{ clicks === 1 ? 'time' : 'times' }}. That click stayed in the browser.</p>
    </div>
  </section>

  <section class="mt-10" aria-labelledby="markers-title">
    <h2 id="markers-title" class="text-lg font-semibold tracking-tight text-highlighted">What xray wrote</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText :text="`This list is the object \`#xray-sources\` exports. ${markers.length} markers were in the source when Nuxt last ran the module.`" />
    </p>
    <div class="mt-4 grid gap-2">
      <label class="text-sm font-semibold" for="xray-marker">Marker</label>
      <select id="xray-marker" v-model="selected" class="marker-select">
        <option v-for="marker in markers" :key="marker.name" :value="marker.name">{{ marker.name }}</option>
      </select>
    </div>
    <article v-if="current" class="mt-4">
      <h3 :id="'marker-' + current.name" class="text-sm font-semibold text-highlighted">{{ current.name }}</h3>
      <p class="mt-1 text-sm text-muted">
        <InlineText :text="`\`${current.file}\`, lines ${current.start}–${current.end}.`" />
      </p>
      <div class="sample mt-2" tabindex="0" role="region" :aria-labelledby="'marker-' + current.name">
        <pre><code>{{ current.code }}</code></pre>
      </div>
    </article>
  </section>

  <section class="mt-10" aria-labelledby="install-title">
    <h2 id="install-title" class="text-lg font-semibold tracking-tight text-highlighted">How to install one</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Three steps. The login chapter uses them for the session module.
    </p>
    <ol class="mt-4 grid gap-3">
      <li class="pair-card">
        <p class="text-sm font-semibold">1. Add the package</p>
        <p class="text-sm leading-relaxed text-pretty"><InlineText text="`pnpm add nuxt-auth-utils` writes the dependency into `package.json` and fetches it into `node_modules/`." /></p>
      </li>
      <li class="pair-card">
        <p class="text-sm font-semibold">2. Name it in the config</p>
        <p class="text-sm leading-relaxed text-pretty"><InlineText text="Put the package name in the `modules` array in `nuxt.config.ts`, next to the ones already there." /></p>
        <div class="sample" tabindex="0" role="region" aria-label="The modules array">
          <pre><code>modules: ['@nuxt/ui', './modules/xray/index', 'nuxt-auth-utils']</code></pre>
        </div>
      </li>
      <li class="pair-card">
        <p class="text-sm font-semibold">3. Start the server again</p>
        <p class="text-sm leading-relaxed text-pretty"><InlineText text="`make dev` starts Nuxt, and Nuxt calls `setup()` on the new module before the first request." /></p>
      </li>
    </ol>
  </section>
</template>
