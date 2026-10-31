<script setup lang="ts">
import type { RequestTrace } from '../../utils/story'

const traces = useTraceIds()
const replay = useReplay()
const first = ref<RequestTrace | null>(null)
const click = ref<RequestTrace | null>(null)

watch(() => traces.value['board-fetch'] ?? '', async (id) => {
  if (!id) return
  first.value = await $fetch<RequestTrace>(`/api/_xray/${id}`).catch(() => null)
}, { immediate: true })

watch(() => replay.value?.traceId ?? '', async (id) => {
  if (!id) {
    click.value = null
    return
  }
  click.value = await $fetch<RequestTrace>(`/api/_xray/${id}`).catch(() => null)
}, { immediate: true })

function milliseconds(trace: RequestTrace | null) {
  if (!trace?.queries) return ''
  const total = trace.queries.reduce((sum, query) => sum + query.ms, 0)
  return `${total} ms in SQLite`
}

const rows = computed(() => {
  const action = click.value
  return [
    {
      layer: 'browser',
      name: 'Browser',
      first: 'The browser asked for this page, the way a client connects to a server.',
      click: action ? 'The page was already open. The click ran here, in the browser.' : 'Add or move a task to see this path.'
    },
    {
      layer: 'vue',
      name: 'Vue',
      first: 'The server ran the same components and wrote HTML. The browser then took over those elements. That takeover is hydration.',
      click: action ? 'Vue already had the page. It changed the list in place, so the card moved without a new document.' : 'Waiting for a click.'
    },
    {
      layer: 'network',
      name: 'Network',
      first: first.value
        ? `${first.value.method} ${first.value.path} ran on the server while it built the HTML. The browser did not ask for it again.`
        : 'The board request ran on the server. The browser did not ask for it again.',
      click: action ? `${action.method} ${action.path}` : 'No request yet.'
    },
    {
      layer: 'server',
      name: 'Server',
      first: 'server/api/board.get.ts read the rows and returned JSON, and the server turned that JSON into HTML.',
      click: action
        ? (action.path.includes('/api/tasks') && action.method === 'POST'
            ? 'server/api/tasks.post.ts inserted the row and sent that row back.'
            : 'server/api/tasks/[id].patch.ts updated the column and sent the row back.')
        : 'Waiting for a click.'
    },
    {
      layer: 'database',
      name: 'Database',
      first: first.value ? `The read queries took ${milliseconds(first.value)}.` : 'SQLite answered the board queries.',
      click: action ? `The write took ${milliseconds(action)}.` : 'No statement yet.'
    }
  ]
})
</script>

<template>
  <section class="mt-8" aria-labelledby="journey-title">
    <h2 id="journey-title" class="text-sm font-semibold text-highlighted">Two ways the words arrive</h2>
    <p class="mt-1 max-w-xl text-sm text-muted">
      The same layers. The first load does the work on the server and sends HTML. A later click sends one request and Vue patches the page.
    </p>
    <div class="mt-3 overflow-x-auto">
      <table class="w-full min-w-[36rem] border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr>
            <th class="w-28 px-2 text-left text-xs font-medium uppercase tracking-wide text-muted" scope="col">Layer</th>
            <th class="px-2 text-left text-xs font-medium uppercase tracking-wide text-muted" scope="col">First load</th>
            <th class="px-2 text-left text-xs font-medium uppercase tracking-wide text-muted" scope="col">After a click</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.layer">
            <th
              class="rounded-s-md px-2 py-2 text-left align-top text-xs font-semibold uppercase tracking-wide"
              scope="row"
              :style="{ background: `var(--layer-${row.layer}-bg)`, color: `var(--layer-${row.layer})` }"
            >
              {{ row.name }}
            </th>
            <td class="px-2 py-2 align-top" :style="{ background: `var(--layer-${row.layer}-bg)` }">{{ row.first }}</td>
            <td class="rounded-e-md px-2 py-2 align-top" :style="{ background: `var(--layer-${row.layer}-bg)` }">{{ row.click }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
