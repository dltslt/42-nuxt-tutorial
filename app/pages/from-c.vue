<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">A web app for a C programmer</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      A Nuxt app is two programs. The <strong class="term-browser">browser</strong> shows the page. <strong class="term-server">Node</strong> runs the server. They talk through a socket, the way a client and a server share a connected socket in C.
    </p>
    <ChaptersProcesses />
    <ChaptersMapping />
    <p class="mt-8 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/anatomy" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Project anatomy</NuxtLink>.
    </p>
  </div>
</template>
