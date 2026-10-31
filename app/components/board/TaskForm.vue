<script setup lang="ts">
import { placeTask, type Board, type BoardTask } from '../../utils/board'
import type { XrayHit } from '../../composables/useXray'

const props = defineProps<{ board: Board }>()

const traces = useTraceIds()
const origins = useRowOrigins()
const replay = useReplay()
const pending = ref(false)
const error = ref('')

function hitFor(task: BoardTask, marker: string): XrayHit {
  const handler = marker === 'create-fetch' ? 'create-handler' : 'move-handler'
  return {
    words: task.title,
    rowId: task.id,
    field: 'title',
    query: 'tasks',
    traceId: traces.value[marker] ?? '',
    snippets: { template: 'task-title', fetch: marker, handler }
  }
}

async function onSubmit(event: Event) {
  const form = event.currentTarget
  if (!(form instanceof HTMLFormElement)) return
  const data = new FormData(form)
  const title = String(data.get('title') ?? '').trim()
  const columnId = String(data.get('column_id') ?? '')
  pending.value = true
  error.value = ''
  try {
    // xray:create-fetch
    const response = await $fetch.raw<{ tasks: BoardTask[] }>('/api/tasks', {
      method: 'POST',
      body: { title, column_id: columnId }
    })
    // /xray:create-fetch
    traces.value = rememberTrace(traces.value, 'create-fetch', response.headers.get('x-trace-id'))
    const task = response._data?.tasks[0]
    if (!task) return
    origins.value = { ...origins.value, [task.id]: 'create-fetch' }
    placeTask(props.board, task)
    replay.value = hitFor(task, 'create-fetch')
    form.reset()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'The task was not added'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="flex max-w-sm flex-col gap-3" @submit.prevent="onSubmit">
    <div>
      <label for="task-title" class="text-sm font-medium">Title</label>
      <input
        id="task-title"
        name="title"
        required
        maxlength="80"
        autocomplete="off"
        class="mt-1 w-full rounded-md bg-default px-3 py-2 text-base ring ring-default"
      >
    </div>
    <fieldset>
      <legend class="text-sm font-medium">Column</legend>
      <div class="mt-1 flex flex-col gap-1">
        <label v-for="(column, index) in board.columns" :key="column.id" class="flex items-center gap-2 text-sm">
          <input type="radio" name="column_id" :value="column.id" :checked="index === 0" required>
          {{ column.title }}
        </label>
      </div>
    </fieldset>
    <UButton type="submit" class="self-start" label="Add task" :loading="pending" />
    <p v-if="error" class="text-sm text-error" role="alert">{{ error }}</p>
  </form>
</template>
