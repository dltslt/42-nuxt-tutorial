<script setup lang="ts">
import componentSource from '../../../test/component.test.ts?raw'
import routeSource from '../../../test/routes.test.ts?raw'

const step = ref(0)
const steps = [
  {
    title: 'Vitest reads the files',
    layer: 'server',
    sentence: '`vitest.config.ts` names two projects. `test/routes.test.ts` runs in Node. `test/component.test.ts` runs in the Nuxt test environment.'
  },
  {
    title: 'A server starts',
    layer: 'server',
    sentence: '`setup()` builds the app and listens. That build is a production build, so the test sets `NUXT_APP_SECRET`. The database is a new file, not `.data/tutorial.sqlite`.'
  },
  {
    title: 'A request is a function call',
    layer: 'network',
    sentence: '`$fetch` sends `GET /api/board`, `GET /api/me`, and `POST /api/login` to that server. A missing session is status 401. A wrong password is status 401 as well.'
  },
  {
    title: 'A component mounts',
    layer: 'vue',
    sentence: '`mountSuspended` renders `InlineText` inside Vitest. The check looks for a `code` element whose text is `GET /api/me`. No browser window opens.'
  },
  {
    title: 'The process exits',
    layer: 'server',
    sentence: '`make test` prints pass or fail and then exits. It does not keep serving. `make dev` is the process that stays up.'
  }
]

const files = [
  {
    id: 'routes',
    name: 'routes.test.ts',
    text: 'This file calls the running handlers. Dinner must be on the board, a session-less `GET /api/me` must be 401, and `ada` with `bread` must come back as Ada.',
    source: routeSource
  },
  {
    id: 'component',
    name: 'component.test.ts',
    text: 'This file mounts `InlineText` and reads the DOM the render produced. The backticks in the sentence become one `code` element.',
    source: componentSource
  }
]

const chosen = ref(files[0]!.id)
const currentStep = computed(() => steps[step.value]!)
const currentFile = computed(() => files.find(file => file.id === chosen.value)!)

const checks = [
  '`GET /api/board` includes Dinner and cut the bread.',
  '`GET /api/me` without a session is status 401.',
  '`POST /api/login` with `ada` and `bread` returns Ada.',
  '`POST /api/login` with a wrong password is status 401.',
  '`InlineText` renders `GET /api/me` inside a `code` element.'
]

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), steps.length - 1)
}
</script>

<template>
  <section class="mt-8" aria-labelledby="test-steps-title">
    <h2 id="test-steps-title" class="text-lg font-semibold tracking-tight text-highlighted">What make test does</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="Five steps. The command is `make test`, from `nuxt-tutorial/`." />
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of one test run">
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

  <section class="mt-10" aria-labelledby="checks-title">
    <h2 id="checks-title" class="text-lg font-semibold tracking-tight text-highlighted">The five checks</h2>
    <ul class="mt-3 max-w-xl list-disc space-y-2 ps-5 text-sm leading-relaxed text-pretty">
      <li v-for="check in checks" :key="check">
        <InlineText :text="check" />
      </li>
    </ul>
  </section>

  <section class="mt-10" aria-labelledby="test-file-title">
    <h2 id="test-file-title" class="text-lg font-semibold tracking-tight text-highlighted">The file Vitest loads</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      This is the source on disk. A passing run does not change it.
    </p>
    <div class="mt-4 grid gap-2">
      <label class="text-sm font-semibold" for="test-file">File</label>
      <select id="test-file" v-model="chosen" class="marker-select">
        <option v-for="file in files" :key="file.id" :value="file.id">{{ file.name }}</option>
      </select>
    </div>
    <article class="mt-4">
      <h3 id="test-file-name" class="text-sm font-semibold text-highlighted">{{ currentFile.name }}</h3>
      <p class="mt-1 text-sm leading-relaxed text-pretty text-muted"><InlineText :text="currentFile.text" /></p>
      <div class="sample sample-scroll mt-2" tabindex="0" role="region" aria-labelledby="test-file-name">
        <pre><code>{{ currentFile.source }}</code></pre>
      </div>
    </article>
    <p class="sr-only" aria-live="polite">{{ currentFile.name }}. {{ currentFile.text.replaceAll('`', '') }}</p>
  </section>
</template>
