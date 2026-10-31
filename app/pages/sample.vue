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
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Sample content</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      This page is a working board. Change it, and you can watch that change travel through <strong class="term">Nuxt</strong> and come back as words on the screen.
    </p>
    <ul class="mt-4 max-w-xl list-disc space-y-2 ps-5 text-sm leading-relaxed text-pretty text-muted">
      <li>Turn on <strong class="term">X-ray</strong> and point at an underlined word. The panel follows it from the screen, through the <strong class="term-network">request</strong>, to the <strong class="term-database">row</strong>.</li>
      <li>Add a task, or move one. <strong class="term">Replay</strong> then appears under the board and walks that last change, one layer at a time.</li>
      <li>
        <a href="#layers" class="text-highlighted underline decoration-1 underline-offset-2">Two ways the words arrive</a>
        compares the <strong class="term">first load</strong> with a <strong class="term">later click</strong>.
      </li>
    </ul>

    <h2 class="mt-8 text-lg font-semibold tracking-tight text-highlighted">The board</h2>
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
      <XrayJourney />
    </template>
  </div>
</template>
