<script setup lang="ts">
import { tree } from '../utils/anatomy'
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Project anatomy</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Nuxt reads this directory and builds the running app from its shape. Open a file. The label says what that file becomes: a <strong class="term-browser">URL</strong>, a <strong class="term-vue">component</strong>, an <strong class="term-server">API endpoint</strong>, or <strong class="term">generated output</strong>.
    </p>
    <ul class="mt-4 flex flex-wrap gap-2" aria-label="Kinds of file">
      <li class="anatomy-kind" data-kind="url">URL</li>
      <li class="anatomy-kind" data-kind="component">Component</li>
      <li class="anatomy-kind" data-kind="endpoint">API endpoint</li>
      <li class="anatomy-kind" data-kind="generated">Generated output</li>
      <li class="anatomy-kind" data-kind="source">Source</li>
    </ul>
    <p class="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      A few files stay source. The build reads them and writes the generated output beside them.
    </p>
    <div class="anatomy mt-4">
      <ChaptersAnatomyBranch :nodes="tree" />
    </div>
    <p class="mt-8 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/sample" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Sample content</NuxtLink>.
    </p>
  </div>
</template>
