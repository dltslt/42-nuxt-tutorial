<script setup lang="ts">
const traces = useTraceIds()

// xray:board-fetch
// useFetch asks GET /api/board while the server builds the HTML, then the browser reuses that result.
const { data, error } = await useFetch('/api/board', {
  onResponse({ response }) {
    traces.value = rememberTrace(traces.value, 'board-fetch', response.headers.get('x-trace-id'))
  }
})
// /xray:board-fetch
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-highlighted">The board</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
      These cards are not typed into the page. Turn on X-ray and point at anything. For an element, the panel shows the components and template lines that drew it. For underlined words, it follows them through the request and the server down to the row that holds them. Add a task, or move one: that request is followed the same way.
    </p>

    <UAlert
      v-if="error"
      class="mt-6"
      color="error"
      title="The board did not load"
      :description="error.message"
    />
    <template v-else-if="data">
      <BoardTaskBoard class="mt-6" :board="data" />
      <XrayReplay />
    </template>
  </div>
</template>
