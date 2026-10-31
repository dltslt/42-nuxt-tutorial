<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Testing</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="Vitest runs the checks in `test/`. One file calls the HTTP routes. The other mounts a component. `make test` is the command." />
    </p>
    <ChaptersTesting />
    <p class="mt-8 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/deploy" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Build and deploy</NuxtLink>.
    </p>
  </div>
</template>
