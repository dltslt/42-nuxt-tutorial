<script setup lang="ts">
import { buildStructure, type StructureStep } from '../../utils/structure'

const props = defineProps<{ el: HTMLElement }>()
const route = useRoute()
const html = ref<Record<string, string>>({})
const { $xrayFromServer } = useNuxtApp()
const { showData } = useXray()

const traces = useTraceIds()
const origins = useRowOrigins()
const steps = computed(() => buildStructure(props.el, route, $xrayFromServer(props.el), traces.value, origins.value))

function key(step: StructureStep) {
  return step.place ? `${step.place.file}:${step.place.line}` : ''
}

function layerOf(step: StructureStep) {
  if (step.kind === 'element') return 'browser'
  if (step.kind === 'built') return 'server'
  return 'vue'
}

function show(value: unknown) {
  if (value === null || value === undefined) return 'empty'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

watch(steps, async (list) => {
  for (const step of list) {
    const id = key(step)
    if (!id || html.value[id] || step.place!.line <= 1) continue
    const source = await $fetch<{ html: string }>('/api/_xray/source', {
      query: { file: step.place!.file, line: step.place!.line }
    }).catch(() => null)
    if (source) html.value = { ...html.value, [id]: source.html }
  }
}, { immediate: true })
</script>

<template>
  <ol class="flex flex-col gap-3">
    <li v-for="(step, index) in steps" :key="`${step.kind}-${index}`">
      <article
        class="layer-card p-3"
        :style="{ borderLeftColor: `var(--layer-${layerOf(step)})`, background: `var(--layer-${layerOf(step)}-bg)` }"
      >
        <p class="text-xs font-semibold uppercase tracking-wide">{{ index + 1 }}. {{ step.kind }}</p>
        <h3 class="mt-1 font-mono text-sm font-semibold">{{ step.title }}</h3>
        <p class="mt-1 text-sm leading-relaxed"><InlineText :text="step.sentence" /></p>

        <dl v-if="step.props" class="mt-3 grid grid-cols-[6rem_1fr] gap-x-2 gap-y-1 text-sm">
          <template v-for="(value, name) in step.props" :key="name">
            <dt class="font-mono text-xs">{{ name }}</dt>
            <dd class="break-all font-mono text-xs">{{ show(value) }}</dd>
          </template>
        </dl>

        <UButton
          v-if="step.link"
          class="mt-3"
          size="sm"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
          :label="`Follow “${step.link.words}” to its database row`"
          @click="showData(step.link)"
        />

        <p v-if="step.code" class="mt-3 break-words font-mono text-xs">{{ step.code }}</p>

        <div v-if="step.place && html[key(step)]" class="mt-3">
          <p class="mb-1 font-mono text-xs">{{ step.place.file }}:{{ step.place.line }}</p>
          <div class="syntax overflow-x-auto rounded-md text-xs" v-html="html[key(step)]" />
        </div>
        <p v-else-if="step.place" class="mt-3 font-mono text-xs">{{ step.place.file }}</p>
      </article>
    </li>
  </ol>
</template>
