<script setup lang="ts">
import sources from '#xray-sources'
import { buildStory, langFor, type RequestTrace, type Snippet, type StoryLayer } from '../../utils/story'

const replay = useReplay()
const trace = ref<RequestTrace | null>(null)
const step = ref(0)
const html = ref<Record<string, string>>({})

watch(() => replay.value?.traceId ?? '', async (id) => {
  step.value = 0
  if (!id) {
    trace.value = null
    return
  }
  trace.value = await $fetch<RequestTrace>(`/api/_xray/${id}`).catch(() => null)
}, { immediate: true })

const story = computed(() => {
  if (!replay.value || !trace.value || trace.value.id !== replay.value.traceId) return [] as StoryLayer[]
  return buildStory(replay.value, trace.value, sources as Record<string, Snippet>)
})

const current = computed(() => story.value[step.value] ?? null)

watch(current, async (layer) => {
  if (!layer) return
  const blocks: { id: string, code: string, lang: string }[] = []
  if (layer.snippet && !html.value[layer.snippet.name]) {
    blocks.push({ id: layer.snippet.name, code: layer.snippet.code, lang: langFor(layer.snippet.file) })
  }
  if (layer.sql && !html.value[`sql:${layer.sql}`]) {
    blocks.push({ id: `sql:${layer.sql}`, code: layer.sql, lang: 'sql' })
  }
  if (!blocks.length) return
  const fresh = await $fetch<Record<string, string>>('/api/_xray/highlight', { method: 'POST', body: { blocks } })
  html.value = { ...html.value, ...fresh }
}, { immediate: true })

function entries(record: Record<string, unknown> | null | undefined) {
  return Object.entries(record ?? {})
}

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), story.value.length - 1)
}
</script>

<template>
  <section v-if="replay" class="mt-8" aria-label="Replay">
    <h2 class="text-sm font-semibold text-highlighted">Replay</h2>
    <p class="mt-1 max-w-xl text-sm text-muted">
      The last add or move, one layer at a time. The same values X-ray shows, walked forward from the click.
    </p>

    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Layers of this request">
        <li v-for="(layer, index) in story" :key="`${layer.title}-${index}`" class="flex-1">
          <button
            type="button"
            class="h-2 w-full rounded-full"
            :style="{ background: index === step ? `var(--layer-${layer.layer})` : `var(--layer-${layer.layer}-bg)` }"
            :aria-current="index === step ? 'step' : undefined"
            :aria-label="`${index + 1}. ${layer.name}: ${layer.title}`"
            @click="go(index)"
          />
        </li>
      </ol>
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step >= story.length - 1" @click="go(step + 1)">
        Next
      </button>
    </div>

    <article
      v-if="current"
      class="layer-card mt-3 p-3"
      :style="{ borderLeftColor: `var(--layer-${current.layer})`, background: `var(--layer-${current.layer}-bg)` }"
    >
      <p class="text-xs font-semibold uppercase tracking-wide">{{ step + 1 }}. {{ current.name }}</p>
      <h3 class="mt-1 text-sm font-semibold">{{ current.title }}</h3>
      <p class="mt-1 text-sm leading-relaxed">{{ current.sentence }}</p>
      <p v-if="current.quote" class="mt-3 text-lg font-medium">“{{ current.quote }}”</p>
      <div v-if="current.snippet" class="mt-3">
        <p class="mb-1 font-mono text-xs">{{ current.snippet.file }}:{{ current.snippet.start }}</p>
        <div class="syntax overflow-x-auto rounded-md text-xs" v-html="html[current.snippet.name] || ''" />
      </div>
      <dl v-if="current.record" class="mt-3 grid grid-cols-[8rem_1fr] gap-x-2 gap-y-1 text-sm">
        <template v-for="[key, value] in entries(current.record)" :key="key">
          <dt class="font-mono text-xs">{{ key }}</dt>
          <dd :class="key === current.focus ? 'font-semibold underline decoration-2 underline-offset-2' : ''">
            {{ value ?? 'empty' }}
          </dd>
        </template>
      </dl>
      <div v-if="current.sql" class="mt-3">
        <div class="syntax overflow-x-auto rounded-md text-xs" v-html="html[`sql:${current.sql}`] || ''" />
        <p class="mt-2 text-xs">
          <template v-if="current.params?.length">Parameters: {{ current.params.join(', ') }}</template>
          <template v-else>No parameters.</template>
        </p>
      </div>
      <dl v-if="current.row" class="mt-3 grid grid-cols-[8rem_1fr] gap-x-2 gap-y-1 text-sm">
        <template v-for="[key, value] in entries(current.row)" :key="key">
          <dt class="font-mono text-xs">{{ key }}</dt>
          <dd :class="key === current.focus ? 'font-semibold underline decoration-2 underline-offset-2' : ''">
            {{ value ?? 'empty' }}
          </dd>
        </template>
      </dl>
    </article>
    <p v-else class="mt-3 text-sm text-muted">Reading the request…</p>
  </section>
</template>
