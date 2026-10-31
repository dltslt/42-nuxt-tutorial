<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Modules</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="A module runs when Nuxt builds, not when a request arrives. `modules/xray/` and `@nuxt/ui` are the two this app loads." />
    </p>
    <ChaptersModules />
    <p class="mt-8 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/login" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Login</NuxtLink>.
    </p>
  </div>
</template>
