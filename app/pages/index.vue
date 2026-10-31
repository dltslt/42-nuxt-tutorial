<script setup lang="ts">
const traceId = useState<string | null>('board-trace', () => null)

// xray:board-fetch
// useFetch asks GET /api/board while the server builds the HTML, then the browser reuses that result.
const { data, error } = await useFetch('/api/board', {
  onResponse({ response }) {
    traceId.value = response.headers.get('x-trace-id')
  }
})
// /xray:board-fetch
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-highlighted">The board</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
      These cards are not typed into the page. Turn on X-ray and click a title. The panel shows the template, the request, the server function, and the row that holds the words.
    </p>

    <UAlert
      v-if="error"
      class="mt-6"
      color="error"
      title="The board did not load"
      :description="error.message"
    />
    <BoardTaskBoard v-else-if="data" class="mt-6" :board="data" />
  </div>
</template>
