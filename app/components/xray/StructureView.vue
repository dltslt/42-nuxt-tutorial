<script setup lang="ts">
const props = defineProps<{ el: HTMLElement }>()

const instance = computed(() => instanceOf(props.el))
</script>

<template>
  <div class="text-sm">
    <p class="font-mono">{{ labelFor(el) }}</p>
    <p v-if="instance" class="mt-1 font-mono text-xs text-muted">{{ fileOf(instance) }}</p>
  </div>
</template>
