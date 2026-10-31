<script setup lang="ts">
// step is a ref: Vue re-renders these two cards when it changes.
// The browser and the server are separate processes. This component only draws that fact.
const step = ref(0)

const steps = [
  {
    title: 'Two programs',
    active: 'both',
    browser: 'The browser is one process. Its memory holds the page you are looking at.',
    server: 'Node is another process. Its memory holds the Nuxt server started by `make dev`.',
    wire: 'A socket is the connection between those processes. Nothing has been written on it yet.',
    packet: '',
    at: '50%'
  },
  {
    title: 'The port is open',
    active: 'server',
    browser: 'The address bar says `localhost:3042`. That host and port name the other process.',
    server: '`make dev` started Node, and Nitro is listening on port 3042. A C server would be inside `listen()` and `accept()` here.',
    wire: 'The connection is open. Later requests reuse this socket.',
    packet: 'connected',
    at: '50%'
  },
  {
    title: 'The browser writes',
    active: 'browser',
    browser: 'The browser writes an HTTP request, the same role as `write()` on a connected socket.',
    server: 'The handler has not run. The bytes are still in the kernel, on their way to Node.',
    wire: 'Request bytes move toward the server.',
    packet: 'GET /api/board',
    at: '72%'
  },
  {
    title: 'The server answers',
    active: 'server',
    browser: 'The browser is reading. In C this is the `read()` that waits for the reply.',
    server: '`server/api/board.get.ts` runs, reads SQLite, and writes a JSON body back on the socket.',
    wire: 'Response bytes move back toward the browser.',
    packet: '200 JSON',
    at: '28%'
  },
  {
    title: 'The page updates',
    active: 'browser',
    browser: 'Vue takes the JSON and writes the task titles into the page. That board is the sample.',
    server: 'The handler has returned. The Node process stays up and waits for the next request.',
    wire: 'The socket stays open. The next click writes another request on it.',
    packet: '',
    at: '50%'
  }
]

const current = computed(() => steps[step.value]!)

function go(next: number) {
  step.value = Math.min(Math.max(next, 0), steps.length - 1)
}
</script>

<template>
  <section class="mt-8" aria-labelledby="processes-title">
    <h2 id="processes-title" class="text-lg font-semibold tracking-tight text-highlighted">Two processes and a socket</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Walk one request. Each process keeps its own memory. A value arrives as bytes on the socket.
    </p>

    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step === 0" @click="go(step - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of one request">
        <li v-for="(item, index) in steps" :key="item.title" class="flex-1">
          <button
            type="button"
            class="h-2 w-full rounded-full bg-accented"
            :style="index === step ? { background: 'var(--layer-network)' } : undefined"
            :aria-current="index === step ? 'step' : undefined"
            :aria-label="`${index + 1}. ${item.title}`"
            @click="go(index)"
          />
        </li>
      </ol>
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="step >= steps.length - 1" @click="go(step + 1)">
        Next
      </button>
    </div>

    <div class="socket mt-4" :data-active="current.active">
      <article
        class="layer-card p-3"
        :style="{ borderLeftColor: 'var(--layer-browser)', background: 'var(--layer-browser-bg)' }"
      >
        <h3 class="text-sm font-semibold">Browser</h3>
        <p class="mt-2 text-sm leading-relaxed text-pretty"><InlineText :text="current.browser" /></p>
      </article>

      <div class="socket-wire" :style="{ '--at': current.at }">
        <p class="socket-caption">{{ current.wire }}</p>
        <p v-if="current.packet" class="socket-packet">{{ current.packet }}</p>
      </div>

      <article
        class="layer-card p-3"
        :style="{ borderLeftColor: 'var(--layer-server)', background: 'var(--layer-server-bg)' }"
      >
        <h3 class="text-sm font-semibold">Node, running Nuxt</h3>
        <p class="mt-2 text-sm leading-relaxed text-pretty"><InlineText :text="current.server" /></p>
      </article>
    </div>
    <p class="sr-only" aria-live="polite">{{ current.title }}. {{ current.wire }}</p>
  </section>
</template>
