<script setup lang="ts">
defineProps<{
  task: {
    id: string
    title: string
    level: string
    lead: string | null
    parent_title: string | null
  }
}>()
</script>

<template>
  <article class="rounded-lg bg-default p-3 shadow-sm ring ring-default">
    <h3 class="text-sm font-medium text-highlighted">{{ task.title }}</h3>
    <p class="mt-1 text-xs text-muted">
      {{ task.level }}<template v-if="task.lead"> · {{ task.lead }}</template>
    </p>
    <p v-if="task.parent_title" class="mt-1 text-xs text-muted">
      inside {{ task.parent_title }}
    </p>
  </article>
</template>
