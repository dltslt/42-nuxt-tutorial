<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Vue reactivity</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="A `ref` is a value a template reads. Writing it re-renders the components that read it during their last render. A `computed` caches a result until one of those reads changes." />
    </p>
    <ChaptersReactivity />
  </div>
</template>
