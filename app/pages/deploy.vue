<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Build and deploy</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="`make build` writes `.output/`. `make preview` serves that folder. A container for ft_transcendence is explained here, and this tutorial does not ship one." />
    </p>
    <ChaptersDeploy />
    <p class="mt-8 text-sm text-pretty text-muted">
      <InlineText text="That is the build. `make dev` is still the process for the chapters above." />
    </p>
  </div>
</template>
