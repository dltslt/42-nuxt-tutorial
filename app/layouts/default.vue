<script setup lang="ts">
const xray = useState('xray-enabled', () => false)
</script>

<template>
  <div class="min-h-dvh bg-default text-default">
    <header class="border-b border-default bg-default/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div class="min-w-0">
          <p class="text-sm font-semibold tracking-tight">Lerch, explained</p>
          <p class="truncate text-xs text-muted">From a row in the database to a word on the screen.</p>
        </div>
        <div class="ms-auto flex items-center gap-3">
          <USwitch v-model="xray" label="X-ray" />
          <UColorModeButton />
        </div>
      </div>
    </header>
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-[11rem_1fr]">
      <nav aria-label="Chapters">
        <p class="text-xs font-medium uppercase tracking-wide text-muted">Chapters</p>
        <p class="mt-3 text-sm font-medium text-highlighted">The board</p>
        <p class="mt-3 text-xs leading-relaxed text-muted">The other chapters follow this screen.</p>
      </nav>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
