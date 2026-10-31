<script setup lang="ts">
const props = defineProps<{
  task: {
    id: string
    title: string
    level: string
    lead: string | null
    parent_title: string | null
  }
  nextTitle: string
}>()

const emit = defineEmits<{ move: [] }>()

const { enabled } = useXray()
const traces = useTraceIds()
const origins = useRowOrigins()

function hit(words: string, field: string) {
  const fetch = origins.value[props.task.id] ?? 'board-fetch'
  const handler = fetch === 'create-fetch' ? 'create-handler' : fetch === 'move-fetch' ? 'move-handler' : 'board-handler'
  return {
    words,
    rowId: props.task.id,
    field,
    query: 'tasks',
    traceId: traces.value[fetch] ?? '',
    snippets: { template: `task-${field}`, fetch, handler }
  }
}
</script>

<template>
  <article class="rounded-lg bg-default p-3 shadow-sm ring ring-default">
    <!-- xray:task-title -->
    <h3 class="text-sm font-medium text-highlighted">
      <button type="button" class="xray-hit" :aria-disabled="enabled ? undefined : true" v-xray="hit(task.title, 'title')">
        {{ task.title }}
      </button>
    </h3>
    <!-- /xray:task-title -->
    <p class="mt-1 flex items-center gap-1 text-xs text-muted">
      <UBadge :label="task.level" color="neutral" variant="subtle" size="sm" />
      <template v-if="task.lead">
        ·
        <!-- xray:task-lead -->
        <button type="button" class="xray-hit" :aria-disabled="enabled ? undefined : true" v-xray="hit(task.lead, 'lead')">
          {{ task.lead }}
        </button>
        <!-- /xray:task-lead -->
      </template>
    </p>
    <button type="button" class="mt-2 text-xs text-muted underline-offset-2 hover:underline" @click="emit('move')">
      Move to {{ nextTitle }}
    </button>
    <p v-if="task.parent_title" class="mt-1 text-xs text-muted">
      inside
      <!-- xray:task-parent_title -->
      <button type="button" class="xray-hit" :aria-disabled="enabled ? undefined : true" v-xray="hit(task.parent_title, 'parent_title')">
        {{ task.parent_title }}
      </button>
      <!-- /xray:task-parent_title -->
    </p>
  </article>
</template>
