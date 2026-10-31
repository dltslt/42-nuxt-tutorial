<script setup lang="ts">
const props = defineProps<{ open?: boolean }>()

// The browser owns this after the first paint. A bound `open` that never
// changes would snap the row shut again on the next parent render.
const opened = ref(!!props.open)

function onToggle(event: Event) {
  const next = (event.currentTarget as HTMLDetailsElement).open
  if (next !== opened.value) opened.value = next
}
</script>

<template>
  <details :open="opened" @toggle="onToggle">
    <slot />
  </details>
</template>
