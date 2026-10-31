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
          <h2 class="text-sm font-semibold text-highlighted">{{ column.title }}</h2>
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
          <span class="font-medium">{{ blocker.blocker_title }}</span>
          blocks
          <span class="font-medium">{{ blocker.blocked_title }}</span>
          <span class="text-muted">· {{ blocker.severity }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
