<script setup lang="ts">
const titles = ['Dinner', 'Supper', 'Lunch']
const title = ref(titles[0]!)
const count = ref(1)
// computed caches this until count changes. Reading title does not clear the cache.
const doubled = computed(() => count.value * 2)
const notice = ref('Change the title or the count. A box re-renders when a value it shows has changed.')

const section = computed(() => `${title.value}, ${count.value}`)

function rename() {
  const index = titles.indexOf(title.value)
  title.value = titles[(index + 1) % titles.length]!
  notice.value = 'The title changed. This section and the title box re-rendered. The count and the double stayed.'
}

function add() {
  count.value += 1
  notice.value = 'The count changed. This section, the count, and the double re-rendered. The title box stayed.'
}
</script>

<template>
  <section class="mt-8" aria-labelledby="reactivity-title">
    <h2 id="reactivity-title" class="text-lg font-semibold tracking-tight text-highlighted">What re-renders</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="Each box is its own component. `ref` notifies the boxes that read it. `computed` runs again only when `count` changes, then the double box receives the new number." />
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" @click="rename">
        Change the title
      </button>
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" @click="add">
        Add one to the count
      </button>
    </div>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))">
      <ChaptersRenderProbe title="This section" :value="section" />
      <ChaptersRenderProbe title="Title" :value="title" />
      <ChaptersRenderProbe title="Count" :value="count" />
      <ChaptersRenderProbe title="Double" :value="doubled" />
    </div>
    <p class="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted" aria-live="polite">{{ notice }}</p>
  </section>
</template>
