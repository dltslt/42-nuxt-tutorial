<script setup lang="ts">
defineProps<{
  board: {
    columns: Array<{
      id: string
      title: string
      state: string
      tasks: Array<{
        id: string
        title: string
        level: string
        lead: string | null
        parent_title: string | null
      }>
    }>
    blockers: Array<{
      id: string
      severity: string
      blocker_title: string
      blocked_title: string
    }>
  }
}>()

const { enabled } = useXray()

function columnHit(column: { id: string, title: string }) {
  return {
    words: column.title,
    rowId: column.id,
    field: 'title',
    query: 'columns',
    snippets: { template: 'column-title', fetch: 'board-fetch', handler: 'board-handler' }
  }
}

function blockerHit(blocker: { id: string, blocker_title: string, blocked_title: string, severity: string }, field: 'blocker_title' | 'blocked_title' | 'severity') {
  return {
    words: blocker[field],
    rowId: blocker.id,
    field,
    query: 'blockers',
    snippets: { template: `blocker-${field}`, fetch: 'board-fetch', handler: 'board-handler' }
  }
}
</script>

<template>
  <div>
    <div class="grid gap-3 md:grid-cols-3">
      <section
        v-for="column in board.columns"
        :key="column.id"
        class="flex min-h-64 flex-col rounded-xl bg-elevated/60 p-3 ring ring-default"
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
            <BoardTaskCard :task="task" />
          </li>
        </ul>
        <p v-else class="mt-8 text-center text-xs text-muted">Nothing here.</p>
      </section>
    </div>

    <section class="mt-4 rounded-xl bg-elevated/60 p-4 ring ring-default" aria-label="Blockers">
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
