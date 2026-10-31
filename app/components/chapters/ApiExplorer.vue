<script setup lang="ts">
const routes = [
  {
    id: 'board',
    method: 'GET',
    path: '/api/board',
    call: true,
    text: 'The file is `server/api/board.get.ts`. The handler reads `columns`, `tasks`, and `blockers`, and returns one JSON object. Sending this request does not change the database.'
  },
  {
    id: 'tables',
    method: 'GET',
    path: '/api/tables?table=tasks',
    call: true,
    text: 'The file is `server/api/tables.get.ts`. The `table` parameter must be `actors`, `columns`, `tasks`, or `blockers`. Anything else is status 400. Sending this request does not change the database.'
  },
  {
    id: 'create',
    method: 'POST',
    path: '/api/tasks',
    call: false,
    text: 'The file is `server/api/tasks.post.ts`. The sample form posts a title and a `column_id`, and the handler inserts a row. This page does not send that request.'
  },
  {
    id: 'move',
    method: 'PATCH',
    path: '/api/tasks/:id',
    call: false,
    text: 'The file is `server/api/tasks/[id].patch.ts`. Brackets in the file name are the id in the path. The sample board sends a new `column_id` when a task moves. This page does not send that request.'
  }
]

const selected = ref(routes[0]!.id)
const current = computed(() => routes.find(route => route.id === selected.value)!)
const pending = ref(false)
const failure = ref('')
const status = ref<number | null>(null)
const body = ref('')

async function send() {
  const route = current.value
  if (!route.call) return
  pending.value = true
  failure.value = ''
  status.value = null
  body.value = ''
  try {
    const response = await $fetch.raw(route.path)
    status.value = response.status
    body.value = JSON.stringify(response._data, null, 2)
  }
  catch {
    failure.value = 'The request failed.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="mt-8" aria-labelledby="api-title">
    <h2 id="api-title" class="text-lg font-semibold tracking-tight text-highlighted">The endpoints</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="A file under `server/api/` becomes a URL. The verb is the suffix: `.get` is GET, `.post` is POST. Pick one. GET can be sent from here. The writes stay on the sample board." />
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <label v-for="route in routes" :key="route.id" class="pair-card">
        <input v-model="selected" type="radio" name="api-route" :value="route.id">
        <span class="pair-names">
          <span>{{ route.method }}</span>
          <span>{{ route.path }}</span>
        </span>
        <p><InlineText :text="route.text" /></p>
      </label>
    </div>
    <div v-if="current.call" class="mt-4">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="pending" @click="send">
        {{ pending ? 'Sending' : 'Send this request' }}
      </button>
      <p v-if="failure" class="mt-3 text-sm text-pretty" role="alert">{{ failure }}</p>
      <div v-else-if="body" class="api-body mt-3" tabindex="0" role="region" aria-label="Response body">
        <p class="api-status">{{ status }}</p>
        <pre>{{ body }}</pre>
      </div>
    </div>
  </section>
</template>
