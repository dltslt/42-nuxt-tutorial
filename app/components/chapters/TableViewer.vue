<script setup lang="ts">
const names = ['actors', 'columns', 'tasks', 'blockers'] as const
const table = ref<typeof names[number]>('actors')

type TableBody = {
  table: string
  columns: string[]
  rows: Record<string, unknown>[]
}

const { data, error, status } = await useFetch<TableBody>(() => `/api/tables?table=${table.value}`)

function cell(row: Record<string, unknown>, column: string) {
  const value = row[column]
  return value == null ? '' : String(value)
}

const caption = computed(() => `Rows from \`${table.value}\``)
</script>

<template>
  <section class="mt-10" aria-labelledby="tables-title">
    <h2 id="tables-title" class="text-lg font-semibold tracking-tight text-highlighted">The tables</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="These rows are in `.data/tutorial.sqlite`. `server/plugins/seed.ts` created them the first time the server started, and only if `tasks` was empty." />
    </p>
    <div class="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Tables">
      <label v-for="name in names" :key="name" class="pair-card table-pick">
        <input v-model="table" type="radio" name="sql-table" :value="name">
        <span>{{ name }}</span>
      </label>
    </div>
    <p v-if="error" class="mt-4 text-sm text-pretty" role="alert">The table did not load.</p>
    <p v-else-if="status === 'pending'" class="mt-4 text-sm text-muted">Loading the rows.</p>
    <div
      v-else-if="data"
      class="table-wrap mt-4"
      tabindex="0"
      role="region"
      aria-labelledby="table-caption"
    >
      <table class="rows">
        <caption id="table-caption"><InlineText :text="caption" /></caption>
        <thead>
          <tr>
            <th v-for="column in data.columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data.rows" :key="index">
            <th scope="row">{{ cell(row, data.columns[0]!) }}</th>
            <td
              v-for="column in data.columns.slice(1)"
              :key="column"
              :style="{ '--label': `'${column}'` }"
            >
              {{ cell(row, column) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
