<script setup lang="ts">
import sources from '#xray-sources'
import { buildStory, langFor, type BoardTrace, type Snippet, type StoryLayer } from '../../utils/story'

const { open, hit } = useXray()
const traceId = useState<string | null>('board-trace', () => null)
const trace = ref<BoardTrace | null>(null)
const missing = ref(false)
const html = ref<Record<string, string>>({})

const story = computed(() => {
  if (!hit.value || !trace.value) return [] as StoryLayer[]
  return buildStory(hit.value, trace.value, sources as Record<string, Snippet>)
})

watch([open, traceId], async ([isOpen, id]) => {
  if (!isOpen || !id) return
  missing.value = false
  try {
    trace.value = await $fetch<BoardTrace>(`/api/_xray/${id}`)
  } catch {
    trace.value = null
    missing.value = true
  }
})

watch(story, async (layers) => {
  const blocks: { id: string, code: string, lang: string }[] = []
  for (const layer of layers) {
    if (layer.snippet) {
      blocks.push({ id: layer.snippet.name, code: layer.snippet.code, lang: langFor(layer.snippet.file) })
    }
    if (layer.sql) blocks.push({ id: `sql:${layer.sql}`, code: layer.sql, lang: 'sql' })
  }
  if (!blocks.length) {
    html.value = {}
    return
  }
  html.value = await $fetch<Record<string, string>>('/api/_xray/highlight', {
    method: 'POST',
    body: { blocks }
  })
}, { immediate: true })

function entries(record: Record<string, unknown> | null | undefined) {
  return Object.entries(record ?? {})
}
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    title="How this got on the screen"
    description="Read from the words you clicked down to the cell in the table."
    :ui="{ content: 'sm:max-w-xl' }"
  >
    <template #body>
      <p v-if="missing" class="text-sm text-muted">
        This request is no longer in memory. Reload the page, then click the word again.
      </p>
      <p v-else-if="!story.length" class="text-sm text-muted">Reading the request…</p>
      <ol v-else class="flex flex-col gap-3">
        <li v-for="(layer, index) in story" :key="`${layer.title}-${index}`">
          <article
            class="layer-card p-3"
            :style="{
              borderLeftColor: `var(--layer-${layer.layer})`,
              background: `var(--layer-${layer.layer}-bg)`
            }"
          >
            <p class="text-xs font-semibold uppercase tracking-wide">
              {{ index + 1 }}. {{ layer.name }}
            </p>
            <h2 class="mt-1 text-sm font-semibold">{{ layer.title }}</h2>
            <p class="mt-1 text-sm leading-relaxed">{{ layer.sentence }}</p>

            <p v-if="layer.quote" class="mt-3 text-lg font-medium">“{{ layer.quote }}”</p>

            <div v-if="layer.snippet" class="mt-3">
              <p class="mb-1 font-mono text-xs">
                {{ layer.snippet.file }}:{{ layer.snippet.start }}
              </p>
              <div
                class="syntax overflow-x-auto rounded-md text-xs"
                v-html="html[layer.snippet.name] || ''"
              />
            </div>

            <dl v-if="layer.record" class="mt-3 grid grid-cols-[8rem_1fr] gap-x-2 gap-y-1 text-sm">
              <template v-for="[key, value] in entries(layer.record)" :key="key">
                <dt class="font-mono text-xs">{{ key }}</dt>
                <dd :class="key === layer.focus ? 'font-semibold underline decoration-2 underline-offset-2' : ''">
                  {{ value ?? 'empty' }}
                  <span v-if="key === layer.focus" class="ms-1 text-xs font-normal">this field</span>
                </dd>
              </template>
            </dl>

            <div v-if="layer.sql" class="mt-3">
              <div class="syntax overflow-x-auto rounded-md text-xs" v-html="html[`sql:${layer.sql}`] || ''" />
              <p class="mt-2 text-xs">
                <template v-if="layer.params?.length">Parameters: {{ layer.params.join(', ') }}</template>
                <template v-else>No parameters.</template>
              </p>
            </div>

            <dl v-if="layer.row" class="mt-3 grid grid-cols-[8rem_1fr] gap-x-2 gap-y-1 text-sm">
              <template v-for="[key, value] in entries(layer.row)" :key="key">
                <dt class="font-mono text-xs">{{ key }}</dt>
                <dd :class="key === layer.focus ? 'font-semibold underline decoration-2 underline-offset-2' : ''">
                  {{ value ?? 'empty' }}
                  <span v-if="key === layer.focus" class="ms-1 text-xs font-normal">this cell</span>
                </dd>
              </template>
            </dl>
          </article>
        </li>
      </ol>
    </template>
  </USlideover>
</template>
