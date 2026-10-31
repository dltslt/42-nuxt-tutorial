<script setup lang="ts">
import { placeTask, type Board, type BoardTask } from '../../utils/board'

const props = defineProps<{ board: Board }>()

const { enabled } = useXray()
const traces = useTraceIds()
const origins = useRowOrigins()
const replay = useReplay()
const moving = ref('')
const moveError = ref('')

function nextColumn(columnId: string) {
  const index = props.board.columns.findIndex(column => column.id === columnId)
  const following = props.board.columns[(index + 1) % props.board.columns.length]
  return following ?? props.board.columns[0]
}

async function move(task: BoardTask) {
  if (moving.value) return
  const next = nextColumn(task.column_id)
  if (!next) return
  moving.value = task.id
  moveError.value = ''
  try {
    // xray:move-fetch
    const response = await $fetch.raw<{ tasks: BoardTask[] }>(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { column_id: next.id }
    })
    // /xray:move-fetch
    traces.value = rememberTrace(traces.value, 'move-fetch', response.headers.get('x-trace-id'))
    const moved = response._data?.tasks[0]
    if (!moved) return
    origins.value = { ...origins.value, [moved.id]: 'move-fetch' }
    placeTask(props.board, moved)
    replay.value = {
      words: moved.title,
      rowId: moved.id,
      field: 'title',
      query: 'tasks',
      traceId: traces.value['move-fetch'] ?? '',
      snippets: { template: 'task-title', fetch: 'move-fetch', handler: 'move-handler' }
    }
  } catch (cause) {
    moveError.value = cause instanceof Error ? cause.message : 'The task did not move'
  } finally {
    moving.value = ''
  }
}

function columnHit(column: { id: string, title: string }) {
  return {
    words: column.title,
    rowId: column.id,
    field: 'title',
    query: 'columns',
    traceId: traces.value['board-fetch'] ?? '',
    snippets: { template: 'column-title', fetch: 'board-fetch', handler: 'board-handler' }
  }
}

function blockerHit(blocker: { id: string, blocker_title: string, blocked_title: string, severity: string }, field: 'blocker_title' | 'blocked_title' | 'severity') {
  return {
    words: blocker[field],
    rowId: blocker.id,
    field,
    query: 'blockers',
    traceId: traces.value['board-fetch'] ?? '',
    snippets: { template: `blocker-${field}`, fetch: 'board-fetch', handler: 'board-handler' }
  }
}
</script>

<template>
  <div>
    <BoardTaskForm :board="board" />
    <p v-if="moveError" class="mt-3 text-sm text-error" role="alert">{{ moveError }}</p>
    <div class="mt-6 grid gap-3 md:grid-cols-3">
      <section
        v-for="column in board.columns"
        :key="column.id"
        class="board-column flex min-h-64 flex-col rounded-xl p-3 ring ring-default"
      >
        <header>
          <!-- xray:column-title -->
          <h2 class="text-sm font-semibold text-highlighted">
            <button type="button" class="xray-hit" :aria-disabled="enabled ? undefined : true" v-xray="columnHit(column)">
              {{ column.title }}
            </button>
          </h2>
          <!-- /xray:column-title -->
          <p class="text-xs text-muted">{{ column.state }}</p>
        </header>
        <ul v-if="column.tasks.length" class="mt-3 flex flex-col gap-2">
          <li v-for="task in column.tasks" :key="task.id">
            <BoardTaskCard :task="task" :next-title="nextColumn(column.id)?.title ?? ''" @move="move(task)" />
          </li>
        </ul>
        <p v-else class="mt-8 text-center text-xs text-muted">Nothing here.</p>
      </section>
    </div>

    <section class="board-blockers mt-4 rounded-xl p-4 ring ring-default" aria-label="Blockers">
      <h2 class="text-sm font-semibold text-highlighted">Blockers</h2>
      <ul class="mt-2 flex flex-col gap-1">
        <li v-for="blocker in board.blockers" :key="blocker.id" class="text-sm">
          <!-- xray:blocker-blocker_title -->
          <button type="button" class="xray-hit font-medium" :aria-disabled="enabled ? undefined : true" v-xray="blockerHit(blocker, 'blocker_title')">
            {{ blocker.blocker_title }}
          </button>
          <!-- /xray:blocker-blocker_title -->
          blocks
          <!-- xray:blocker-blocked_title -->
          <button type="button" class="xray-hit font-medium" :aria-disabled="enabled ? undefined : true" v-xray="blockerHit(blocker, 'blocked_title')">
            {{ blocker.blocked_title }}
          </button>
          <!-- /xray:blocker-blocked_title -->
          ·
          <!-- xray:blocker-severity -->
          <button type="button" class="xray-hit text-muted" :aria-disabled="enabled ? undefined : true" v-xray="blockerHit(blocker, 'severity')">
            {{ blocker.severity }}
          </button>
          <!-- /xray:blocker-severity -->
        </li>
      </ul>
    </section>
  </div>
</template>
