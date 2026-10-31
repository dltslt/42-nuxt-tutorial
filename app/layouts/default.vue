<script setup lang="ts">
const { enabled } = useXray()
const route = useRoute()

const chapters = [
  { to: '/', title: 'Welcome' },
  { to: '/from-c', title: 'A web app for a C programmer' },
  { to: '/anatomy', title: 'Project anatomy' },
  { to: '/sample', title: 'Sample content' },
  { to: '/rendering', title: 'Rendering' },
  { to: '/reactivity', title: 'Vue reactivity' },
  { to: '/routes', title: 'Server routes and database' },
  { to: '/languages', title: 'Languages' },
  { to: '/modules', title: 'Modules' },
  { to: '/login', title: 'Login' },
  { to: '/testing', title: 'Testing' }
]

watch(enabled, (on) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('xray-on', on)
}, { immediate: true })
</script>

<template>
  <div class="min-h-dvh bg-default text-default">
    <header data-xray-ui class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur">
      <div class="mx-auto flex items-center gap-4 px-4 py-3" :class="enabled ? 'max-w-[96rem]' : 'max-w-6xl'">
        <div class="min-w-0">
          <p class="text-sm font-semibold tracking-tight">Nuxt, explained</p>
          <p class="truncate text-xs text-muted">From a row in the database to a word on the screen.</p>
        </div>
        <div class="ms-auto flex items-center gap-3">
          <USwitch v-model="enabled" label="X-ray" />
          <UColorModeButton />
        </div>
      </div>
    </header>
    <div
      class="mx-auto grid gap-8 px-4 py-6"
      :class="enabled ? 'max-w-[96rem] md:grid-cols-[11rem_1fr] lg:grid-cols-[11rem_1fr_minmax(24rem,32rem)]' : 'max-w-6xl md:grid-cols-[11rem_1fr]'"
    >
      <nav class="chapter-nav" aria-label="Chapters">
        <p class="text-xs font-medium uppercase tracking-wide text-muted">Chapters</p>
        <ul class="mt-3 space-y-2">
          <li v-for="chapter in chapters" :key="chapter.to">
            <NuxtLink
              :to="chapter.to"
              class="text-sm"
              :class="route.path === chapter.to ? 'font-medium text-highlighted' : 'text-muted'"
              :aria-current="route.path === chapter.to ? 'page' : undefined"
            >
              {{ chapter.title }}
            </NuxtLink>
          </li>
        </ul>
        <p class="mt-3 text-xs leading-relaxed text-muted">The build follows.</p>
      </nav>
      <main class="min-w-0">
        <slot />
      </main>
      <ClientOnly>
        <XrayPanel v-if="enabled" class="md:col-span-2 lg:col-span-1" />
      </ClientOnly>
    </div>
    <ClientOnly>
      <XraySelector />
    </ClientOnly>
  </div>
</template>
