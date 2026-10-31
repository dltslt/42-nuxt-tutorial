<script setup lang="ts">
const { selected, pinned, view, hit, pin } = useXray()

const crumbs = computed(() => (selected.value ? crumbsFor(selected.value).reverse() : []))
</script>

<template>
  <aside data-xray-ui class="xray-panel flex flex-col gap-3 rounded-xl bg-elevated/60 p-4 ring ring-default" aria-label="X-ray">
    <header>
      <h2 class="text-sm font-semibold text-highlighted">
        {{ view === 'data' ? 'How these words got on the screen' : 'What put this element on the screen' }}
      </h2>
      <p class="mt-1 text-xs text-muted">
        <template v-if="pinned">Pinned. Click it again or press Esc to let go.</template>
        <template v-else>Point at anything on the page. Click to pin it, then read here.</template>
      </p>
    </header>

    <nav v-if="crumbs.length" aria-label="Enclosing elements" class="flex flex-wrap items-center gap-1 text-xs">
      <template v-for="(crumb, index) in crumbs" :key="index">
        <span v-if="index" class="text-muted">›</span>
        <button
          type="button"
          class="rounded px-1.5 py-0.5 font-mono ring ring-default"
          :class="crumb === selected && !hit ? 'bg-default font-semibold' : 'hover:bg-default'"
          @click="pin(crumb as HTMLElement)"
        >
          {{ labelFor(crumb) }}
        </button>
      </template>
    </nav>

    <p v-if="view === 'empty'" class="text-sm text-muted">Nothing selected yet.</p>
    <XrayDataView v-else-if="view === 'data'" />
    <XrayStructureView v-else :el="selected!" />
  </aside>
</template>
