<script setup lang="ts">
const props = defineProps<{ text: string }>()

// Backticks in a sentence are the inline-code spans. The rest stays text.
const parts = computed(() => {
  const chunks: { code: boolean, value: string }[] = []
  const pattern = /`([^`]+)`/g
  let cursor = 0
  for (const match of props.text.matchAll(pattern)) {
    const at = match.index ?? 0
    if (at > cursor) chunks.push({ code: false, value: props.text.slice(cursor, at) })
    chunks.push({ code: true, value: match[1]! })
    cursor = at + match[0].length
  }
  if (cursor < props.text.length) chunks.push({ code: false, value: props.text.slice(cursor) })
  return chunks
})
</script>

<template>
  <span>
    <template v-for="(part, index) in parts" :key="index">
      <code v-if="part.code" class="token">{{ part.value }}</code>
      <template v-else>{{ part.value }}</template>
    </template>
  </span>
</template>
