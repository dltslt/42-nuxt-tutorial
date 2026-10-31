<script setup lang="ts">
const props = defineProps<{
  task: {
    id: string
    title: string
    level: string
    lead: string | null
    parent_title: string | null
  }
}>()

const { enabled } = useXray()

function hit(words: string, field: string) {
  return {
    words,
    rowId: props.task.id,
    field,
    query: 'tasks',
    snippets: { template: `task-${field}`, fetch: 'board-fetch', handler: 'board-handler' }
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
